import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbThemeService, NbWindowService} from '@nebular/theme';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import {mergeMap, toArray} from 'rxjs/operators';
import {from} from 'rxjs/internal/observable/from';
import CONFIG from '../../../app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EChartOption} from 'echarts';
import CREDENTIALS from '../../../credential.config';
import {of} from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs/index';
import {ForceLink} from '../../../shared/model/mitigate/forceLink';
import {flatten} from '@angular/compiler';
import {ShowComponent} from '../../../../components/table/show/show.component';
import {ItemDetailService} from '../../../@core/services/finsec/item-detail/item-detail.service';

@Component({
             selector: 'total-vulnerabilities',
             templateUrl: 'vulnerabilities.component.html',
             styleUrls: ['vulnerabilities.component.scss'],
           })
export class VulnerabilitiesComponent implements AfterViewInit, OnDestroy, OnInit {
  data: any;
  options: Observable<EChartOption>;
  fields = ['name', 'subtype', 'description', 'domain', 'external_references'];
  themeSubscription: any;
  currentTheme: string;
  source: any = [];
  intermediateSourceArray: any = [];
  refMap = new Map();
  nodes = [];
  links = [];
  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
        width: '5%',
      },
      description: {
        title: 'Description',
        type: 'string',
        width: '60%',
      },
      asset: {
        title: 'Asset name',
        type: 'string',
        width: '10%',
      },
      vendor: {
        title: 'Vendor name',
        type: 'string',
        width: '5%',
      },
      product: {
        title: 'Product name',
        type: 'string',
        width: '5%',
      },
      version: {
        title: 'Product version',
        type: 'string',
        width: '5%',
      },
      score: {
        title: 'Base Score',
        type: 'string',
        width: '5%',
      },
      score_number: {
        title: 'Base Score (numerical)',
        type: 'string',
        width: '5%',
      },
      /*external_references: {
          title: 'External references',
          type: "html",
          width: '30%',
          valuePrepareFunction: (value) => value.map(item => {
              return '<div >External Identifier: ' + item.external_id + '&nbsp;&nbsp;' +
              ', Resource name: ' + item.resource_name + '&nbsp;&nbsp;' +
              ', Ref source: ' + item.refsource + '&nbsp;&nbsp;' +
              ', Ref url: ' + '<a target="_blank" href=' + item.url + '>Details</a></div>';
          }),
      },*/
    },
  };
  @ViewChild('contentTemplate', {static: false}) contentTemplate: TemplateRef<any>;
  private alive = true;

  constructor(private theme: NbThemeService,
              private itemDetailService: ItemDetailService,
              private datalayerService: DatalayerService,
              private http: HttpClient,
              private windowService: NbWindowService) {
  }


  openGraph() {
    this.windowService.open(this.contentTemplate, {
      title: `Finsec Graph`,
    });
  }

  ngAfterViewInit(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    const headers = {
      headers: new HttpHeaders({
                                 'Accept': 'application/json',
                                 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                               }),
    };
    this.datalayerService.rootNode('x-asset').pipe(mergeMap((asset: any) => from(asset)
      .pipe(mergeMap(item => {
                       if (typeof item['vuln_refs'] === 'object' && item['vuln_refs'].length > 0) {
                         return this.http.post(CONFIG.finsec_kb_url, {
                           '$query': {
                             type: 'vulnerability',
                             id: {'$in': item['vuln_refs']},
                           },
                         }, headers).toPromise().then((vulns: Array<any>) => {
                           if (vulns.length > 0) {
                             this.refMap.set(item, vulns);
                             return vulns;
                           } else {
                             return [];
                           }
                         });
                       } else {
                         return of([]);
                       }
                     },
      )))).pipe(mergeMap((vulnerability: any) => from(vulnerability).pipe(mergeMap(item => {

      return this.http.post(CONFIG.finsec_kb_url, {
        '$query': {
          type: 'x-vulnerability-score',
          reference: item['id'],
        },
      }, headers);
    }), toArray())), toArray())
        .subscribe(scores => {
          const flat = [].concat(...scores);
          scores = flat.some(Array.isArray) ? flatten(flat) : flat;
          const that = {...this};
          this.refMap.forEach(function (value, key, map) {
            that.nodes.push(key);
            value.forEach(function (vuln) {

              that.nodes.push(vuln);
              if (key['vuln_refs'].includes(vuln.id)) {
                scores.forEach(function (score) {
                  if (score['subtype'] === 'CVSS_v3') {
                    return;
                  } else {
                    if (score['reference'] === vuln.id) {
                      if (score['details']['base_score'] === 0) {
                        vuln.score = 'None';
                      } else if (score['details']['base_score'] < 2.5 && score['details']['base_score'] > 0) {
                        vuln.score = 'Low';
                      } else if (score['details']['base_score'] >= 2.5 && score['details']['base_score'] < 5) {
                        vuln.score = 'Medium';
                      } else if (score['details']['base_score'] >= 5 && score['details']['base_score'] < 8) {
                        vuln.score = 'High';
                      } else {
                        vuln.score = 'Critical';
                      }
                      vuln.score_number = score['details']['base_score'];
                    }
                  }
                });
                vuln.asset = key['name'];
                vuln.vendor = key['product_vendor'];
                vuln.product = key['product_name'];
                vuln.version = key['product_version'];
                that.intermediateSourceArray.push(vuln);
              }
            });
            that.links = that.links.concat(
              value.map(vuln =>
                          new ForceLink(vuln['id'], key['id']),
              ),
            );
          });
          this.source = this.intermediateSourceArray;
          const graph = {'nodes': this.nodes, 'links': this.links};
          const categories = [];
          graph.nodes.forEach(function (node) {
            node.symbolSize = 25;
            node.category = node.type;
            node.symbol = node.type ? 'image://../../../assets/images/visualizer/' + node.type + '.png' : 'circle';
            node.x = node.y = null;
            node.draggable = true;
            if (categories.findIndex(category => category.name === node.type) === -1) {
              categories.push({
                                'name': node.type, 'symbol': node.symbol,
                              });
            }
          });
          that.options = of({
                              title: {
                                text: '',
                                subtext: '',
                                top: 'bottom',
                                left: 'right',
                              },
                              tooltip: {
                                confine: true,
                                formatter: function (params) {
                                  if (params.dataType !== 'edge') {
                                    if (!(params.data.type === 'x-risk')) {
                                      return 'type: ' +
                                             params.data.type +
                                             '<br/>' +
                                             'name: ' +
                                             params.data.name +
                                             '<br/>' +
                                             'subtype: ' +
                                             params.data.subtype +
                                             '<br/>' +
                                             'domain: ' +
                                             params.data.domain +
                                             '<br/>' +
                                             'description: ' +
                                             params.data.description;
                                    }
                                    return 'type: ' +
                                           params.data.type +
                                           '<br/>' +
                                           'total risk: ' +
                                           params.data.total_risk +
                                           '<br/>' +
                                           'total_risk_numerical: ' +
                                           params.data.total_risk_numerical;
                                  }
                                },
                              },
                              legend: [
                                {
                                  itemHeight: 20,
                                  itemWidth: 20,
                                  textStyle: {
                                    color: '#fff',
                                    fontSize: 20,
                                  },
                                  data: categories.map(function (a) {
                                    return {name: a.name, icon: a.symbol};
                                  }),

                                },
                              ],
                              animation: false,
                              series: [
                                {
                                  name: 'Overview',
                                  type: 'graph',
                                  layout: 'force',
                                  data: graph.nodes,
                                  links: graph.links,
                                  distance: 2,
                                  categories: categories,
                                  label: {
                                    normal: {
                                      position: 'right',
                                    },
                                  },
                                  force: {
                                    repulsion: 75,
                                    edgeLength: 70,
                                  },
                                  linestyle: {
                                    color: '#000',
                                  },
                                  itemStyle: {
                                    normal: {
                                      label: {
                                        show: false,
                                        textStyle: {
                                          color: 'yellow',
                                        },
                                      },
                                      nodeStyle: {
                                        brushType: 'both',
                                        borderColor: 'rgba(255,215,0,0.4)',
                                        borderWidth: 1,
                                      },
                                    },
                                    emphasis: {
                                      label: {
                                        show: false,
                                      },
                                      nodeStyle: {},
                                      linkStyle: {},
                                    },
                                  },
                                  minRadius: 15,
                                  maxRadius: 25,
                                  gravity: 1.1,
                                  scaling: 1.2,
                                  draggable: false,
                                  steps: 10,
                                  coolDown: 0.9,
                                },
                              ],
                            });
        });
  }

  onRowSelect(event): void {
    this.itemDetailService.addItem(event);
    this.windowService.open(ShowComponent, {title: `Details`, context: {fields: this.fields}});
  }

  onDeleteConfirm($event): void {
    return;
  }
}

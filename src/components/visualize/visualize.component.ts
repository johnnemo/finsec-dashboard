import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {EChartOption} from 'echarts';
import {ForceLink} from '../../app/shared/model/mitigate/forceLink';
import {VisualizeService} from '../../app/@core/services/finsec/visualize/visualize.service';
import {NbWindowService} from '@nebular/theme';

@Component({
             selector: 'ngx-visualize',
             templateUrl: './visualize.component.html',
             styleUrls: ['./visualize.component.scss'],
           })
export class VisualizeComponent implements OnInit {


  // demo_html = require('!!html-loader!./vulnerabilities.component.html');
  // demo_ts = require('!!raw-loader!./vulnerabilities.component.ts');
  options: Observable<EChartOption>;
  nodes = [];
  links = [];
  @Input() type: string;
  @Input() identifier: string;
  refMap = new Map();
  @ViewChild('contentTemplate', {static: false}) contentTemplate: TemplateRef<any>;

  constructor(private http: HttpClient,
              private visualizeService: VisualizeService,
              private windowService: NbWindowService) {
  }


  ngOnInit(): void {
    const prom = this.visualizeService.rootNode(this.type, this.identifier).toPromise()
                     .then(data => {
                       let items = data;
                       if (data.attack) {
                         items = data.attack;
                       }
                       items.splice(-1, 1);
                       for (const node of items) {
                         // TODO: provide a better solution instead of loading the instances of the courses of actions
                         if (node['datatype'] !== 'Model' && !data.attack) {
                           continue;
                         }
                         if (!this.nodes.some(item => item['id'] === node.id)) {
                           this.nodes.push(node);
                         }
                         for (const key of Object.keys(node)) {
                           const organization = (node[key] != null) ? node[key] : null;
                           if (key.indexOf('x_organization') !== -1) {
                             if (this.refMap.has(organization)) {
                               this.refMap.set(organization, [node.id, ...this.refMap.get(organization)]);
                             } else {
                               this.refMap.set(organization, [node.id]);
                             }
                           }
                           if (key.indexOf('_ref') !== -1) {
                             const reference = (node[key] != null) ? node[key] : null;
                             if (Array.isArray(reference)) {
                               for (let i = 0; i < reference.length; i++) {
                                 if (this.refMap.has(reference[i])) {
                                   this.refMap.set(reference[i], [node.id, ...this.refMap.get(reference[i])]);
                                 } else {
                                   this.refMap.set(reference[i], [node.id]);
                                 }
                               }
                             } else if (reference !== null) {
                               if (this.refMap.has(reference)) {
                                 this.refMap.set(reference, [node.id, ...this.refMap.get(reference)]);
                               } else {
                                 this.refMap.set(reference, [node.id]);
                               }
                             }
                           }
                           if (key.indexOf('reference') !== -1) {
                             const reference = (node[key] != null) ? node[key] : null;
                             if (Array.isArray(reference)) {
                               for (let i = 0; i < reference.length; i++) {
                                 if (this.refMap.has(reference[i])) {
                                   this.refMap.set(reference[i], [node.id, ...this.refMap.get(reference[i])]);
                                 } else {
                                   this.refMap.set(reference[i], [node.id]);
                                 }
                               }
                             } else if (reference !== null) {
                               if (this.refMap.has(reference)) {
                                 this.refMap.set(reference, [node.id, ...this.refMap.get(reference)]);
                               } else {
                                 this.refMap.set(reference, [node.id]);
                               }
                             }
                           }
                         }
                       }
                     })
                     .then(() => {
                       return this.visualizeService.ids(Array.from(this.refMap.keys())).toPromise();
                     }).then(reference_objects => {
        reference_objects.splice(-1, 1);
        for (const ref_object of reference_objects) {
          if (!this.nodes.some(item => item['id'] === ref_object.id)) {
            this.nodes.push(ref_object);
          }
          this.links = this.links.concat(
            this.refMap.get(ref_object.id)
                .map(ref_node =>
                       new ForceLink(ref_node, ref_object.id),
                ),
          );
        }
      }).then(() => {
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
        return {
          title: {
            text: '',
            subtext: '',
            top: 'bottom',
            left: 'right',
          },
          tooltip: {
            confine: true,
            formatter: function (params, ticket, callback) {
              if (params.dataType !== 'edge') {
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
              return null;
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
              roam: false,
              label: {
                normal: {
                  position: 'right',
                },
              },
              force: {
                repulsion: 75,
                edgeLength: 70,
                initLayout: 'circular',
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
              coolDown: 0.9,
              animationEasing: 'bounceOut',
            },
          ],
        };
      });
    this.options = from(prom);
  }

  openGraph() {
    this.windowService.open(this.contentTemplate, {
      title: `Finsec Graph`,
    });
  }

  details(options: any) {
  }
}

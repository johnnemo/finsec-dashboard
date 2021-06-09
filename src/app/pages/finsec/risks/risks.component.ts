import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {EChartOption} from 'echarts';
import {VisualizeService} from '../../../@core/services/finsec/visualize/visualize.service';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import {from} from 'rxjs/internal/observable/from';
import {ForceLink} from '../../../shared/model/mitigate/forceLink';
import {NbDialogService, NbToastrService, NbWindowService} from '@nebular/theme';
import {ShowComponent} from '../../../../components/table/show/show.component';
import {ItemDetailService} from '../../../@core/services/finsec/item-detail/item-detail.service';
import {RiskAssessmnentService} from '../../../@core/services/finsec/risk-assessment/risk-assessmnent.service';
import {LocalDataSource} from "ng2-smart-table";


@Component({
             selector: 'ngx-services',
             templateUrl: './risks.component.html',
             styleUrls: ['./risks.component.scss'],
           })
export class RisksComponent implements OnInit {
  @Input() type: string;
  source: LocalDataSource;
  sourceItems: any;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'right',
      custom: [
        {
          name: 'de-activate',
          title: '<i class="nb-loop inline-block width: 50px"></i>',
        },
      ],
    },
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      // qualitative_assessment: {
      //     title: 'Qualitative Assessment',
      //     type: 'string',
      // },
      total_quantitative_risk: {
        title: 'Total Quantitative Assessment',
        type: 'html',
        valuePrepareFunction: (quantitative_assessment) => {
          return 'Typical: ' + quantitative_assessment.typical +
                 '<br/>' +
                 'Worst: ' + quantitative_assessment.worst;
        },
      },
      total_risk: {title: 'Total Risk'},
      created: {
        title: 'Created',
        type: 'string',
      },
      modified: {
        title: 'Modified',
        type: 'string',
      },
    },
  };

  options: Observable<EChartOption>;
  nodes = [];
  links = [];
  @Input() identifier: string;
  fields = [
    'name',
    'subtype',
    'description',
    'domain',
    'total_quantitative_risk',
    'total_risk',
  ];
  refMap = new Map();
  @ViewChild('contentTemplate', {static: false}) contentTemplate: TemplateRef<any>;

  constructor(private riskAssessmentService: RiskAssessmnentService,
              private itemDetailService: ItemDetailService,
              private toastr: NbToastrService,
              private visualizeService: VisualizeService,
              private datalayerService: DatalayerService,
              private windowService: NbWindowService,
              private dialogService: NbDialogService) {
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {context: 'this is some additional data passed to dialog'});
  }

  openGraph() {
    this.windowService.open(this.contentTemplate, {
      title: `Finsec Graph`,
    });
  }


  ngOnInit(): void {


    const prom = this.riskAssessmentService.reports().toPromise().then((result: any) => {
      const ordered_results = result.results.reverse();
      this.source = new LocalDataSource(ordered_results);
      this.sourceItems = ordered_results;
      for (const node of ordered_results) {
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
          if (key.indexOf('_refs') !== -1) {
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
              if (params.data.type !== 'x-risk') {
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
                     'name: ' +
                     params.data.name +
                     '<br/>' +
                     'Qualitative Assessment: ' +
                     params.data.qualitative_assessment +
                     '<br/>' +
                     'Typical Quantitative Assessment: ' +
                     params.data.quantitative_assessment.typical +
                     '<br/>' +
                     'Worst Quantitative Assessment: ' +
                     params.data.quantitative_assessment.worst +
                     '<br/>';
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
                edgeLength: 50,
                roam: true,
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
        };
      });
    this.options = from(prom);
  }


  details(options: any) {
  }

  onRowSelect(event) {
    this.itemDetailService.addItem(event);
    this.windowService.open(ShowComponent, {title: `Details`, context: {fields: this.fields}});
  }

  onDeleteConfirm($event) {

  }

  onCustomAction($event) {
    this.riskAssessmentService.recalculate($event.data.asset_refs[0]).toPromise().then(data => {
      /*
      TODO: maybe check the response from RAE
      */
      this.datalayerService.rootNode('x-risk').toPromise().then(result => {
        result.splice(-1, 1);

        this.toastr.info('The Indicators have been updated');
        // const updateItem = this.source.find(risk => risk.id === $event.data.id);
        // this.source[this.source.indexOf(updateItem)] = result;
        this.source = new LocalDataSource(result.reverse());
        this.source.refresh();
      });
    });
  }
}

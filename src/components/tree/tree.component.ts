import {Component, Input, OnInit} from '@angular/core';
import {VisualizeService} from '../../app/@core/services/finsec/visualize/visualize.service';
import {from, Observable} from 'rxjs';
import {EChartOption} from 'echarts';

@Component({
             selector: 'ngx-tree',
             templateUrl: './tree.component.html',
             styleUrls: ['./tree.component.scss'],
           })
export class TreeComponent implements OnInit {

  options: Observable<EChartOption>;
  nodes = null;
  @Input() root_node: string = null;

  constructor(private visualizeService: VisualizeService) {
  }

  ngOnInit(): void {

    const prom = this.visualizeService.rootNode(this.root_node).toPromise().then(nodes => {

      this.nodes = nodes.map(node => ({

        name: node.name,
        key: node.id,

        children: Object.keys(node).map(key => {
          if (key.indexOf('asset_refs') !== -1) {


            const refs = (node[key] != null) ? node[key] : null;

            return {
              name: `${key}:`,
              // key: key,
              // isLeaf: false,
              children: null,
              // refs: refs
            };
          } else {

            return {
              name: `${key}: ${node[key]}`,
              // key: key,
              // isLeaf: true
            };
          }
        }),
      }));

      // this.options = {
      //   tooltip: {
      //     trigger: 'item',
      //     triggerOn: 'mousemove'
      //   },
      //   series: [
      //     {
      //       type: 'tree',
      //       data: [this.nodes], //DATA
      //       top: '1%',
      //       left: '15%',
      //       bottom: '1%',
      //       right: '7%',
      //       symbolSize: 7,
      //       orient: 'RL',
      //       label: {
      //         position: 'right',
      //         verticalAlign: 'middle',
      //         align: 'left'
      //       },
      //       leaves: {
      //         label: {
      //           position: 'left',
      //           verticalAlign: 'middle',
      //           align: 'right'
      //         }
      //       },
      //       expandAndCollapse: true,
      //       animationDuration: 550,
      //       animationDurationUpdate: 750
      //     }
      //   ]
      // }
    }).then(() => {
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
        },
        series: [
          {
            type: 'tree',
            data: this.nodes, // DATA
            top: '1%',
            left: '15%',
            bottom: '1%',
            right: '7%',
            symbolSize: 7,
            orient: 'RL',
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
            leaves: {
              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
              },
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],

      };

    });

    this.options = from(prom);
  }

}

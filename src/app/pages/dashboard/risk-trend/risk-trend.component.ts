import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';

@Component({
             selector: 'risk-trend',
             templateUrl: 'risk-trend.component.html',
             styleUrls: ['risk-trend.component.scss'],
           })

export class RiskTrendComponent implements AfterViewInit, OnDestroy, OnInit {
  options: any = {};
  grouped_attacks: any[] = [];
  group: Array<any> = [];
  themeSubscription: any;
  myChart: any;

  constructor(private theme: NbThemeService, private datalayerService: DatalayerService) {
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    const now = new Date();
    now.setDate(now.getDate() - 6);
    const weekDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    weekDay.setUTCHours(0, 0, 0, 0);
    const current = new Date();
    const match = {'created': {'$gt': weekDay.toISOString()}, 'subtype': 'Anomaly Detection'};
    this.datalayerService.groupBy('x-attack', [
      'x_organization', 'attack_type',
    ], 'created', [{'$dayOfWeek': {'$dateFromString': {'dateString': '$created'}}}], match)
        .subscribe(grouped_attacks => {
          if (!grouped_attacks || grouped_attacks.length === 0) {
            return;
          }
          grouped_attacks.splice(-1, 1);
          this.options = {
            tooltip: {
              confine: true,
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: echarts.tooltipBackgroundColor,
                },
              },
            },
            legend: {
              data: [],
              textStyle: {
                color: '#ffffff',
              },
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: [
                  new Date(current.setDate(current.getDate() - 6)).toLocaleString('en-us', {weekday: 'long'}),
                  new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-us', {weekday: 'long'}),
                  new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-us', {weekday: 'long'}),
                  new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-us', {weekday: 'long'}),
                  new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-us', {weekday: 'long'}),
                  new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-us', {weekday: 'long'}),
                  new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-us', {weekday: 'long'}),
                ],
                axisTick: {
                  alignWithLabel: true,
                },
                axisLine: {
                  lineStyle: {
                    color: echarts.axisLineColor,
                  },
                },
                axisLabel: {
                  textStyle: {
                    color: echarts.textColor,
                  },
                },
              },
            ],
            yAxis: [
              {
                type: 'value',
                axisLine: {
                  lineStyle: {
                    color: echarts.axisLineColor,
                  },
                },
                splitLine: {
                  lineStyle: {
                    color: echarts.splitLineColor,
                  },
                },
                axisLabel: {
                  textStyle: {
                    color: echarts.textColor,
                  },
                },
              },
            ],
            series: [],
          };
          const this_copy = {...this};
          grouped_attacks.forEach(function (item) {
            this_copy.grouped_attacks.push({
                                             'day': item._id['created'][0],
                                             'organization': item._id['x_organization'],
                                             'name': item._id['attack_type'] ? item._id['attack_type'] : 'undefined',
                                             'value': item.count,
                                           });
          });

          const result = this.grouped_attacks;
          const categories = [];
          for (const group of result) {
            const weekData = [0, 0, 0, 0, 0, 0, 0];
            if (!this.options.legend.data.includes(group['name'])) {
              this.options.legend.data.push(group['name']);
              categories.push(group['name']);
            }

            const item = {
              org: group['organization'],
              category: group['name'],
              data: [],
            };


            const today = new Date();
            const todayDay = today.getDay() + 1;
            if (todayDay !== (group['day'])) {
              if (todayDay < group['day']) {
                weekData[6 - (todayDay + 7 - group['day'])] += group['value'];
              } else {
                weekData[6 - (todayDay - group['day'])] += group['value'];
              }
            } else {
              weekData[6] += group['value'];
            }
            item.data = weekData;
            this.group.push(item);

          }
          const that = {...this};
          categories.forEach(function (category) {
            const sub = that.group.filter(item => item.category === category).map(subcategory => subcategory.data);
            const res = [0, 0, 0, 0, 0, 0, 0];
            sub.forEach(function (item) {
              for (let i = 0; i < res.length; i++) {
                res[i] += item[i];
              }
            });
            that.options.series.push({
                                       name: category,
                                       type: 'line',
                                       stack: 'Total amount',
                                       areaStyle: {normal: {opacity: echarts.areaOpacity}},
                                       data: res,
                                     });
          });

          this.update();
        });
  }

  update() {
    // const chartElement1 = <HTMLDivElement>document.getElementById('risk-trend');
    // this.myChart = echarts.init(chartElement1);
    // let counter = 0;
    // let value = 0;

    // timer(5, 5000).pipe(take(100)).subscribe(x => {
    //     value = Math.floor((Math.random() * 6) + 1);
    //     if (counter % 3 != 0) {
    //         this.options.series[0].data[6] += value;
    //     }
    //     else {
    //         this.options.series[1].data[6] += value;
    //     }
    //     counter++;
    //     this.myChart.setOption(this.options);
    // });

  }
}

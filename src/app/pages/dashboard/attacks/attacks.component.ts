import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import CONFIG from '../../../app.config';
import {forkJoin} from 'rxjs/index';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';

@Component({
             selector: 'total-attacks',
             templateUrl: 'attacks.component.html',
             styleUrls: ['attacks.component.scss'],
           })
// TODO: reduce number of iterations for the grouped attacks
export class AttacksComponent implements AfterViewInit, OnDestroy, OnInit {
  currentTheme: string;
  attacks: any[];
  attack_count: number;
  anomaly_detection_url = CONFIG.anomaly_detection_url;
  retrieve_url = CONFIG.finsec_retrieve_url;
  grouped_attacks: any[] = [];
  options: Array<any> = []; // change options foreach organization - random colors
  options_bar_animation: any = {};
  themeSubscription: any;
  data: any;
  trend: any;
  myChart: any;
  totalAttacksCurrentMonth = 0;
  totalAttacksPrevMonth = 0;
  organization_name: any;
  private alive = true;

  constructor(private theme: NbThemeService, private http: HttpClient, private datalayerService: DatalayerService) {
  }


  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
      const xAxisData = [];
      const data1 = [];
      const data2 = [];
      const now = new Date();
      const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      for (let i = 0; i < 30; i++) {
        const real = Math.floor(Math.random() * 6) + 1;
        xAxisData.push(firstDayPrevMonth.getDate() + '/' + firstDayPrevMonth.getMonth());
        firstDayPrevMonth.setDate(firstDayPrevMonth.getDate() + 1);
        data1.push(real);
        if (i % 4 === 0) {
          data2.push(real + Math.floor(Math.random() * 2));
        } else {
          data2.push(real - Math.floor(Math.random() * 2));
        }
      }

      this.options_bar_animation = {
        backgroundColor: echarts.bg,
        legend: {
          data: ['Predicted', 'Detected'],
          textStyle: {
            color: '#FFFFFF',
          },
        },
        xAxis:
          {
            data: xAxisData,
            show: true,
            silent: false,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              color: '#FFFFFF',
            },
          },
        yAxis:
          {
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
                color: '#FFFFFF',
              },
            },
          },
        series: [
          {
            name: 'Predicted',
            type: 'bar',
            data: data1,
            animationDelay: idx => idx * 10,
          },
          {
            name: 'Detected',
            type: 'bar',
            data: data2,
            animationDelay: idx => idx * 10 + 100,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: idx => idx * 5,
      };
    });
    setTimeout(() => this.update(), 15500);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    const headers = new HttpHeaders({
                                      'Accept': 'application/json',
                                      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                                    });
    const now = new Date();
    const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    forkJoin(
      this.http.post(this.anomaly_detection_url + '/aggregate', {
        modified_from: firstDayPrevMonth,
        modified_until: lastDayCurrentMonth,
      }, {headers: headers}),
      this.http.post(this.retrieve_url, {
                       '$query': {
                         type: 'x-organization',
                       },
                     },
                     {headers: headers},
      ),
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(([grouped_attacks, organizations]: [any[], any[]]) => {
                   if (grouped_attacks.length <= 1) {
                     return;
                   }
                   grouped_attacks.splice(-1, 1);
                   organizations.splice(-1, 1);
                   const this_copy = {...this};
                   grouped_attacks.forEach(function (item) {
                     organizations.forEach(function (organization) {
                       if (organization.id !== sessionStorage.getItem('x_organization')) {
                         return;
                       }
                       if (organization['id'] === item._id['x_organization']) {
                         this_copy.grouped_attacks.push({
                                                          'year': item._id['modified'][0],
                                                          'month': item._id['modified'][1],
                                                          'organization': item._id['x_organization'],
                                                          'organization_name': organization['name'],
                                                          'name': item._id['attack_type'] || 'Undefined',
                                                          'value': item.count,
                                                        });
                       }
                     });

                   });

                   let sum = 0;
                   const total_grouped_attacks = [];
                   const color_pallete = [];
                   let title = '';
                   const pie_data = [];
                   const pie_labels = [];
                   const month = now.getMonth() + 1;
                   for (const group of this.grouped_attacks) {
                     if (group['organization'] && group['organization'] === sessionStorage.getItem('x_organization')) {
                       this.organization_name = group['organization_name'];
                       if (
                         total_grouped_attacks[group['name']] &&
                         group['month'] === month &&
                         group['year'] === (now.getFullYear())) {
                         total_grouped_attacks[group['name']] += group['value'];
                         sum += group['value'];
                       } else if (
                         !total_grouped_attacks[group['name']]
                         && group['month'] === month &&
                         group['year'] === (now.getFullYear())) {
                         total_grouped_attacks[group['name']] = group['value'];
                         sum += group['value'];
                       }
                       color_pallete.push('#' + Math.random().toString(16).slice(2, 8).toUpperCase());
                       if (group['month'] < month && group['year'] === (now.getFullYear())) {
                         this.totalAttacksPrevMonth += group['value'];
                       } else if (group['month'] === month && group['year'] === (now.getFullYear())) {
                         pie_labels.push(group['name']);
                         pie_data.push(group);
                         title = group['name'];
                         this.totalAttacksCurrentMonth += group['value'];
                       }
                     }
                   }
                   this.trend =
                     this.totalAttacksPrevMonth ?
                       (
                         (this.totalAttacksCurrentMonth - this.totalAttacksPrevMonth)
                         / Math.abs(this.totalAttacksPrevMonth) * 100)
                         .toFixed(2)
                       : 100;

                   this.options.push({
                                       title: {
                                         show: false,
                                         text: this.totalAttacksCurrentMonth,
                                         x: 'center',
                                         textStyle: {
                                           color: '#fff',
                                         },
                                       },
                                       tooltip: {
                                         trigger: 'item',
                                         confine: true,
                                         // formatter: '{a} <br/>' + group + '<br/>{b} : {c} ({d}%)'
                                       },
                                       legend: {
                                         show: false,
                                         x: 'left',
                                         orient: 'vertical',
                                         data: pie_labels,
                                         textStyle: {
                                           color: '#fff',
                                         },
                                       },
                                       calculable: true,
                                       series: [
                                         {
                                           name: 'Attacks',
                                           type: 'pie',
                                           radius: ['40%', '65%'],
                                           avoidLabelOverlap: false,
                                           color: color_pallete,
                                           data: pie_data,
                                           label: {
                                             show: true,
                                             color: '#fff',
                                             position: 'center',
                                             fontSize: 13,
                                             fontWeight: 'bolder',
                                             formatter: '' + this.totalAttacksCurrentMonth,
                                           },
                                         },
                                       ],
                                       trend: this.trend,
                                       organization_name: this.organization_name,
                                     });
                   this.attacks = total_grouped_attacks;
                   this.attack_count = sum;
                 },
      );
    // this.update();
  }

  update() {
    // Dummmy update interval
    /*  const chartElement1 = <HTMLDivElement>document.getElementById('attack--' + this.organization_name);
      this.myChart = echarts.init(chartElement1);
      let counter = 0;
      let value = 0;

      timer(5, 5000).pipe(take(100)).subscribe(x => {
          value = Math.floor((Math.random() * 10) + 1);
          if (counter % 4 == 0) {
              this.options[0].series[0].data[0]['value'] += value;
              this.attacks[this.options[0].series[0].data[0]['name']] += value;
          }
          else if (counter % 5 == 0) {
              this.options[0].series[0].data[1]['value'] += value;
              this.attacks[this.options[0].series[0].data[1]['name']] += value;
          }
          else {
              this.options[0].series[0].data[2]['value'] += value;
              this.attacks[this.options[0].series[0].data[2]['name']] += value;
          }
          this.attack_count += value;
          this.totalAttacksCurrentMonth += value;
          this.trend = this.totalAttacksPrevMonth ?
          ((this.totalAttacksCurrentMonth - this.totalAttacksPrevMonth)
          / Math.abs(this.totalAttacksPrevMonth) * 100).toFixed(2) : 100;
          this.options[0].trend = this.trend;
          this.options[0].series[0].label.formatter = '' + this.totalAttacksCurrentMonth;
          counter++;
          this.myChart.setOption(this.options[0]);
      });*/
  }

  status(value) {
    const percentage = (value / this.attack_count) * 100;
    if (percentage <= 25) {
      return 'success';
    } else if (percentage <= 50) {
      return 'info';
    } else if (percentage <= 75) {
      return 'warning';
    } else {
      return 'danger';
    }
  }
}

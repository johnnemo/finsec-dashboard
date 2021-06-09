import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import CONFIG from '../../../app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {flatten} from '@angular/compiler';
import {TokenService} from '../../../@core/services/shared/token.service';
import {from, of} from 'rxjs';
import {mergeMap, toArray} from 'rxjs/operators';

@Component({
             selector: 'total-vulnerabilities',
             templateUrl: 'vulnerabilities.component.html',
             styleUrls: ['vulnerabilities.component.scss'],
           })
export class VulnerabilitiesComponent implements AfterViewInit, OnDestroy, OnInit {
  data: any;
  options: any;
  themeSubscription: any;
  currentTheme: string;
  flag = false;
  vulnerability_refs: any = [];
  private alive = true;

  constructor(private theme: NbThemeService, private datalayerService: DatalayerService, private http: HttpClient,
              private tokenService: TokenService) {
  }


  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    const headers = new HttpHeaders({
                                      'Accept': 'application/json',
                                      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                                      'X-organization': sessionStorage.getItem('x_organization'),
                                    });

    this.datalayerService.rootNode('x-asset').pipe(mergeMap((asset: any) => from(asset)
      .pipe(mergeMap(item => {
                       if (item['id']) {
                         if (typeof item['vuln_refs'] === 'object' && item['vuln_refs'].length > 0) {
                           return this.http.post(CONFIG.finsec_kb_url, {
                             '$query': {
                               type: 'vulnerability',
                               id: {'$in': item['vuln_refs']},
                             },
                           }, {headers: headers});
                         } else {
                           return of([{}]);
                         }
                       } else {
                         return of([{}]);
                       }
                     },
      )))).pipe(mergeMap((vulnerability: any) => from(vulnerability).pipe(mergeMap(item => {
      if (item['id']) {
        return this.http.post(CONFIG.finsec_kb_url, {
          '$query': {
            type: 'x-vulnerability-score',
            reference: item['id'],
          },
        }, {headers: headers});
      } else {
        return of([]);
      }
    }), toArray())), toArray())
        .subscribe(result => {
          const flat = [].concat(...result);
          result = flat.some(Array.isArray) ? flatten(flat) : flat;
          this.data = result;
          this.options = {
            tooltip: {
              trigger: 'axis', axisPointer: {
                type: 'shadow',
              }, confine: true,
            }, legend: {
              data: ['Cyber', 'Physical'], textStyle: {
                color: '#fff',
              },
            }, grid: {

              containLabel: true, height: 250,
            }, xAxis: [
              {
                type: 'value', show: false,
              },
            ], yAxis: [
              {
                type: 'category',
                axisTick: {show: false},
                data: ['None', 'Low', 'Medium', 'High', 'Critical'],
                show: true,
                nameTextLine: {
                  padding: 5,
                },
                axisLine: {
                  lineStyle: {
                    color: '#fff',
                  },
                },
              },
            ], series: [
              {
                name: 'Cyber', type: 'bar', stack: 'vulnerabilities', label: {
                  normal: {
                    show: true, color: '#fff',
                  },
                }, barWidth: '30%', barGap: '-100%', data: [0, 0, 0, 0, 0],
              }, {
                name: 'Physical', type: 'bar', stack: 'vulnerabilities', label: {
                  normal: {
                    show: true, color: '#fff',
                  },
                }, barWidth: '30%', data: [0, 0, 0, 0, 0],
              },
            ],
          };
          const that = {...this};
          this.data.filter(items => (items['subtype'] === 'CVSS_v3')).forEach(function (vulnerabilityGroup) {
            const it = that;
            it.options.series.forEach(function (serie) {
              const total = that.data.length;
              const cvss3_count = 0;
              if (serie.name === vulnerabilityGroup['domain']) {
                if (that.vulnerability_refs.includes(vulnerabilityGroup['reference'])) {
                  return;
                } else {
                  that.vulnerability_refs.push(vulnerabilityGroup['reference']);
                }
                if (!vulnerabilityGroup['details']['base_score']) {
                  serie.data[0]++;
                } else if (
                  vulnerabilityGroup['details']['base_score'] < 2.5 &&
                  vulnerabilityGroup['details']['base_score'] > 0) {
                  serie.data[1]++;
                } else if (
                  vulnerabilityGroup['details']['base_score'] >= 2.5
                  && vulnerabilityGroup['details']['base_score'] < 5) {
                  serie.data[2]++;
                } else if (
                  vulnerabilityGroup['details']['base_score'] >= 5
                  && vulnerabilityGroup['details']['base_score'] < 8) {
                  serie.data[3]++;
                } else {
                  serie.data[4]++;
                }
              }
            });
          });
          this.flag = true;
        });
  }

}

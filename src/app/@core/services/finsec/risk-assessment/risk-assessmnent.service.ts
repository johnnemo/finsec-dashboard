import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import CONFIG from '../../../../app.config';

@Injectable({
              providedIn: 'root',
            })
export class RiskAssessmnentService {
  headers = new HttpHeaders({
                              'Accept': 'application/json',
                              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                              'X-organization': sessionStorage.getItem('x_organization'),
                            });

  risk_assessment_url = CONFIG.risk_assessment_url;

  constructor(private http: HttpClient) {
  }

  reports(): Observable<any> {
    return this.http.get(this.risk_assessment_url + '/risk_reports/per_target/', {headers: this.headers});
  }

  recalculate(asset_id?: string): Observable<any> {
    const target = asset_id ? '/' + asset_id : '';
    return this.http.get(this.risk_assessment_url + '/reset_indicator_values' + target,
                         {headers: this.headers, responseType: 'text'});
  }
}

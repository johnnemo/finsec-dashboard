import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import CONFIG from '../../../../app.config';

@Injectable({
              providedIn: 'root',
            })
export class CollaborativeRiskService {
  headers = new HttpHeaders({
                              'Accept': 'application/json',
                              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                              'X-organization': sessionStorage.getItem('x_organization'),
                            });

  collaborative_risk_url = CONFIG.collaborative_risk_url;

  constructor(private http: HttpClient) {
  }

  rootNode(url: string, root_id?: string, query?: any): Observable<any> {
    if (root_id != null) {
      return this.http.get(this.collaborative_risk_url + '/api/v1/' + url + '/' + root_id,
                           {headers: this.headers});
    }
    return this.http.get(this.collaborative_risk_url + '/api/v1/' + url,
                         {headers: this.headers});
  }

  add(root_type: string, item: any): Observable<any> {
    return this.http.post(this.collaborative_risk_url + '/api/v1/' + root_type, item, {headers: this.headers});
  }

  update(root_type: string, id: string, item: any): Observable<any> {
    return this.http.put(this.collaborative_risk_url + '/api/v1/' + root_type + '/' + id.replace('x-service', ''),
                         item,
                         {headers: this.headers});
  }

}

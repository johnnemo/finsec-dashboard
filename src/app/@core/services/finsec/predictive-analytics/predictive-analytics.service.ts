import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import CONFIG from "../../../../app.config";

@Injectable({
              providedIn: 'root'
            })
export class PredictiveAnalyticsService {

  predictive_analytics_url = CONFIG.predictive_analytics_url;

  constructor(private http: HttpClient) {
  }

  rootNode(root_id?: string): Observable<any> {

    if (root_id != null) {
      return this.http.post(this.predictive_analytics_url + '/daily-attacks', {
        x_organization: sessionStorage.getItem('x_organization'),
        id: root_id
      });
    }
    return this.http.post(this.predictive_analytics_url + '/daily-attacks', {
      x_organization: sessionStorage.getItem('x_organization'),
    });
  }
}

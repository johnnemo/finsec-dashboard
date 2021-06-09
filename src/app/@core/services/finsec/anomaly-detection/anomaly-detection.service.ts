import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import CONFIG from '../../../../app.config';
import {mergeMap, toArray} from 'rxjs/operators';
import {from} from 'rxjs/internal/observable/from';
import {of} from 'rxjs/internal/observable/of';

@Injectable({
              providedIn: 'root',
            })
export class AnomalyDetectionService {

  anomaly_detection_url = CONFIG.anomaly_detection_url;

  constructor(private http: HttpClient) {
  }

  rootNode(root_type: string, root_id?: string, return_objects?: boolean): Observable<any> {

    if (root_id != null) {
      return this.http.post(this.anomaly_detection_url + '/query_attack', {
        x_organization: sessionStorage.getItem('x_organization'),
        id: root_id,
      });
    }
    if (!return_objects) {
      return this.http.post(this.anomaly_detection_url + '/query_attacks',
                            {x_organization: sessionStorage.getItem('x_organization')})
                 .pipe(mergeMap((anomaly: any) => from(anomaly).pipe(mergeMap(attack => {
                   if (attack) {
                     return this.http.post(this.anomaly_detection_url + '/query_attack', {
                       x_organization: sessionStorage.getItem('x_organization'),
                       id: attack,
                     });
                   }
                   return of([]);
                 }), toArray())));
    } else {
      return this.http.post(this.anomaly_detection_url + '/query_attacks?return_objects=true', {
        x_organization: sessionStorage.getItem('x_organization'),
      });
    }

  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import CONFIG from '../../../../app.config';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({
              providedIn: 'root',
            })
export class MitigationService {

  mitigation_service_url = CONFIG.mitigation_service_url;

  constructor(private http: HttpClient) {
  }

  rootNode(root_id?: string): Observable<any> {

    if (!root_id) {
      return this.http.get(this.mitigation_service_url + '/list_coa/');
    }
  }

  activate(root_id: string): Observable<any> {
    return this.http.get(this.mitigation_service_url + '/disable/' + root_id + '/');
  }
}

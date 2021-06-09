import {Injectable} from '@angular/core';
import CONFIG from '../../../../app.config';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable({
              providedIn: 'root',
            })
export class AuditService {

  audit_service_url = CONFIG.audit_service_url;

  constructor(private http: HttpClient) {
  }

  models(): Observable<any> {
    return this.http.get(this.audit_service_url + '/security-models/' + sessionStorage.getItem('x_organization'));
  }

  model(model_id?: string): Observable<any> {
    return this.http.get(this.audit_service_url + '/security-model/' + model_id);
  }

  libraries(library_ids?: Array<any>): Observable<any> {
    const library_id = library_ids[0];
    return this.http.get(this.audit_service_url + '/model-library/' + library_id);
  }

  reports(x_organization): Observable<any> {
    return this.http.get(this.audit_service_url + '/compliance-reports/' + x_organization);
  }

  reportDetails(x_compliance_id): Observable<any> {
    return this.http.get(this.audit_service_url + '/compliance-report/' + x_compliance_id);
  }
}

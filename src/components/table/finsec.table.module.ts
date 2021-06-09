import {NgModule} from '@angular/core';
import {NbCardModule, NbToastrService, NbWindowModule} from '@nebular/theme';
import {ShowComponent} from './show/show.component';
import {ShowModule} from './show/show.module';
import {Ng2SmartTableModule, ServerDataSource} from 'ng2-smart-table';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServerSourceConf} from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import {Observable, throwError} from 'rxjs';

@NgModule({
            imports: [NbWindowModule.forRoot({}), ShowModule, NbCardModule, Ng2SmartTableModule],
            entryComponents: [ShowComponent],

          })
export class FinsecTableModule {
}

export class HeadersServerDataSource extends ServerDataSource {
  httpHeaders: HttpHeaders;

  constructor(protected http: HttpClient,
              headers: HttpHeaders,
              conf: ServerSourceConf | {} = {}
  ) {
    super(http, conf);
    this.httpHeaders = headers;
  }

  protected requestElements(): Observable<any> {
    const httpParams = this.createRequesParams();
    return this.http.get(this.conf.endPoint, {params: httpParams, headers: this.httpHeaders, observe: 'response'});
  }

  protected emitOnChanged(action: string): void {
    this.getElements()
        .then((elements) => {
          this.onChangedSource
              .next({
                      action: action,
                      elements: elements,
                      paging: this.getPaging(),
                      filter: this.getFilter(),
                      sort: this.getSort()
                    });
        })
        .catch((error) => {
          if (error.error.includes('Token Expired')) {
            return throwError(error.error);
          }
          this.onChangedSource
              .next({
                      error: error,
                      action: action,
                      elements: [],
                      paging: this.getPaging(),
                      filter: this.getFilter(),
                      sort: this.getSort()
                    })
        });
  }
}

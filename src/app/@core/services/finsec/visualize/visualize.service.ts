import {Injectable} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import CONFIG from "../../../../app.config";

@Injectable({
              providedIn: 'root'
            })
export class VisualizeService {

  base_url = CONFIG.finsec_retrieve_url;
  kb_url = CONFIG.finsec_kb_url;


  constructor(private http: HttpClient) {
  }

  count(root_type: string): Observable<number> {
    return this.http.post<number>(this.base_url, {
      '$query': {
        type: root_type,
        datatype: "Instance",
        x_organization: sessionStorage.getItem('x_organization')
      }, '$count': "id"
    });
  }

  paginate(root_type: string, pageIndex: number, pageSize: number, sortKey?: string, sortValue?: number) {
    return this.http.post(this.base_url, {
      '$query': {type: root_type, datatype: "Instance"},
      '$orderby': {[sortKey]: sortValue},
      'limit': pageSize
    });
  }

  rootNode(root_type: string, root_id?: string): Observable<any> {
    if (root_type == 'course-of-action') {
      return this.http.post(this.kb_url, {
        '$query': {
          x_organization: sessionStorage.getItem('x_organization')
        }
      })
    }
    if (root_type === 'x-attack') {
      return this.http.post(this.base_url, {
        '$query': {
          x_organization: sessionStorage.getItem('x_organization')
        },
      });
    }
    if (root_id != null) {
      return this.http.post(this.base_url, {id: root_id});
    }
    return this.http.post(this.base_url, {
      '$query': {
        type: root_type,
        datatype: 'Model',
        x_organization: sessionStorage.getItem('x_organization')
      }
    });
  }

  ids(ids: any): Observable<any> {
    return this.http.post(this.base_url, {'$query': {"id": {"$in": ids}}});
  }

}

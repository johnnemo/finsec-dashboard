import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import CONFIG from '../../../../app.config';
import {io, Socket} from 'socket.io-client';
import {Subject} from 'rxjs';

@Injectable({
              providedIn: 'root',
            })
export class DatalayerService {

  retrieve_url = CONFIG.finsec_retrieve_url;
  // TODO: depending on the type select the endpoint to send the object
  insert_url = CONFIG.finsec_kb_create_url;
  retrieve_url_stream = CONFIG.finsec_retrieve_url_stream;
  aggregate_url = CONFIG.finsec_aggregate_url;
  encoder;
  pagination_url = CONFIG.pagination_url;


  constructor(private http: HttpClient) {
    this.encoder = new TextDecoder('utf-8');
  }

  count(root_type: string): Observable<number> {
    return this.http.post<number>(this.aggregate_url, [
      {'$match': {'x_organization': sessionStorage.getItem('x_organization')}},
      {
        '$count': 'count',
      },
    ]);
    // return this.http.post<number>(this.retrieve_url, {
    //   '$query': {type: root_type, datatype: 'Instance', x_organization: sessionStorage.getItem('x_organization')},
    //   '$count': 'id',
    // });
  }

  paginate(root_type: string,
           pageSize: number,
           pageIndex = 0,
           sortKey = 'id',
           sortValue?: number): Observable<any> {
    const headers = new HttpHeaders({
                                      'Accept': 'application/json',
                                      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                                      'X-organization': sessionStorage.getItem('x_organization'),
                                    });
    return this.http.post(this.pagination_url, {
      'root_type': root_type,
      'pageSize': pageSize,
      'pageIndex': pageIndex,
      'sortKey': sortKey,
      'sortValue': sortValue,
      'x_organization': sessionStorage.getItem('x_organization'),
    }, {headers: headers});
  }

  groupBy(root_type: string,
          filter: Array<string>,
          date_filter?: string,
          date_filter_operation?: any,
          match?: any): Observable<any> {
    const id = {};
    filter.forEach(function (item, index) {
      id[item] = `$${item}`;
      if (index === filter.length - 1) {
        if (date_filter && date_filter_operation) {
          id[date_filter] = date_filter_operation;
        }
      }
    });

    const match_expression = {};
    match_expression['type'] = root_type;
    match_expression['x_organization'] = sessionStorage.getItem('x_organization');
    const match_expression_final = {...match_expression, ...match};
    return this.http.post<number>(this.aggregate_url, [
      {'$match': match_expression_final}, {
        '$group': {
          '_id': id, 'count': {'$sum': 1},
        },
      },
    ]);

  }

  rootNode(root_type: string, root_id?: string, query?: any, limit?: any): Observable<any> {

    if (root_id != null) {
      return this.http.post(this.retrieve_url, {id: root_id});
    }
    if (query) {
      const expression = Object.assign({
                                         type: root_type,
                                         x_organization: sessionStorage.getItem('x_organization'),
                                       }, query);
      return this.http.post(this.retrieve_url, {'$query': expression, '$orderby': {'created': -1}, 'limit': limit});
    }
    return this.http.post(this.retrieve_url, {
      '$query': {
        type: root_type,
        x_organization: sessionStorage.getItem('x_organization'),
        query,
      },
      '$orderby': {'created': 1}
    });
  }

  initDataStream(root_type: string, root_id?: string, query?: any): Socket {
    let filters = {type: root_type, x_organization: sessionStorage.getItem('x_organization')};
    if (query) {
      filters = {...filters, ...query, x_organization: sessionStorage.getItem('x_organization')};
    }

    const q = { filters: JSON.stringify(filters)};
    return io({
      query: q,
      extraHeaders: {
        authorization: sessionStorage.getItem('token'),
      },
    });
  }

  rootNodeStream(socket): Observable<any> {
    const sub = new Subject();

    socket.on('data', (data) => {
      sub.next(JSON.parse(this.encoder.decode(data)));
    });

    return sub.asObservable();
  }

  ids(ids: any): Observable<any> {
    return this.http.post(this.retrieve_url, {'$query': {'id': {'$in': ids}}});
  }

  add(input: any): Observable<any> {
    const headers = new HttpHeaders({
                                      'Accept': 'application/json',
                                      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                                      'X-organization': sessionStorage.getItem('x_organization'),
                                    });
    return this.http.post(this.insert_url, input, {headers: headers});
  }

}

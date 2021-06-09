import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import CONFIG from '../../../../app.config';
import * as jwt_decode from 'jwt-decode';
import {of} from 'rxjs';

@Injectable({
              providedIn: 'root',
            })
export class BlockchainService {
  headers = new HttpHeaders({
                              'Accept': 'application/json',
                              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                              'X-organization': sessionStorage.getItem('x_organization'),
                            });

  // blockchain_url = CONFIG.blockchain_base_url;
  mitigate_url = CONFIG.collaborative_risk_url;

  constructor(private http: HttpClient) {
  }

  transaction(id: string) {

  }

  all(created?: any): Observable<any> {
    const headers = new HttpHeaders({
                                      'Accept': 'application/json',
                                      'Authorization': 'Bearer ' + sessionStorage.getItem('blockchain_token'),
                                      'X-organization': sessionStorage.getItem('x_organization'),
                                    });
    return this.http.get(
      this.mitigate_url + "/api/v1/collaboration",{headers: headers});
  }

  //if Alpha -> send request with user_org -> org2
  //if sibs -> send request with user_org -> org2
  //if other -> toastr no access to collaborative service
  // {"user_id":"admin","password":"adminpw"}
  //response
  // {"status":200,"message":"SUCCESS","data":"false","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTQxODAzNjUsImV4cCI6MTYxNDE4NzU2NX0.24AWBxmA3KcktCL82xRcVfG1VRiVbNhmjVvmkgrHWv4"}
  // I keep the token
  // then decode
  // return_args.token = jwt.sign({'userID': req.user_id},  PSK, {expiresIn: '2h'});

  create(input: any): Observable<any> {
    const headers = new HttpHeaders({
                                      'Accept': 'application/json',
                                      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                                      'X-organization': sessionStorage.getItem('x_organization'),
                                    });
    return this.http.post(this.mitigate_url + '/api/v1/collaboration/create', input, {headers: headers});
  }
}

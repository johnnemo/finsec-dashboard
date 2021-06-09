import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import CONFIG from '../../../app.config';
import {Observable} from 'rxjs/Observable';

@Injectable({
              providedIn: 'root',
            })
export class TokenService {
  helper = new JwtHelperService();
  protected token;
  protected client_secret;
  protected refresh_token_url = CONFIG.keycloak;
  protected headers = {
    headers: new HttpHeaders({
                               'Content-Type': 'application/json',
                               'Accept': 'application/json',
                             }),
  };

  constructor(private http: HttpClient) {

  }

  getClientSecret(): Promise<string> {
    return this.http.get('/api/token').toPromise().then(
            result => {
              this.client_secret = result['secret'];
              return this.client_secret;
            },
            error => {
            });
  }


  getToken() {
    return sessionStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  accessTokenExpired(token: string) {
    return this.helper.isTokenExpired(token);
  }

  refreshTokenExpired(token: string) {
    return this.helper.isTokenExpired(token);
  }

  refreshToken(): Observable<any> {
    const headers = {
      headers: new HttpHeaders({
                                 'Content-Type': 'application/x-www-form-urlencoded',
                               }),
    };
    const current_user = {
      grant_type: 'refresh_token',
      refresh_token: sessionStorage.getItem('refresh_token'),
      client_id: 'client-finsec',
      client_secret: this.client_secret,
    };
    const searchParams = Object.keys(current_user).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(current_user[key]);
    }).join('&');
    return this.http.post(this.refresh_token_url, searchParams, headers);
  }
}

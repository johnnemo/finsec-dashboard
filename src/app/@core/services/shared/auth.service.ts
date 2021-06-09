import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from "rxjs/internal/Observable";
import {Router} from "@angular/router";
import CONFIG from "../../../app.config";
import {TokenService} from "./token.service";
import {User} from "../../../shared/model/user";

@Injectable({
              providedIn: 'root'
            })
export class AuthService {
  public redirectUrl = '/dashboard';
  protected headers = {
    headers: new HttpHeaders({
                               'Content-Type': 'application/x-www-form-urlencoded',
                             })
  };
  protected helper = new JwtHelperService();
  protected base_url = CONFIG.keycloak;

  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) {
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.base_url + '/api/auth/register ', user, this.headers);
  }

  loginUser(user: any): Observable<any> {
    const searchParams = Object.keys(user).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(user[key]);
    }).join('&');
    return this.http.post<any>(this.base_url, searchParams, this.headers);
  }

  logoutUser() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('x_organization');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('isLoggedIn') ? true : false;
  }

}

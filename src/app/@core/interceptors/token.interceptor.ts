// src/app/auth/token.interceptor.ts
import {TokenService} from '../services/shared/token.service';
import {AuthService} from '../services/shared/auth.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, switchMap, take} from 'rxjs/operators';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
              providedIn: 'root',
            })
export class TokenInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(public tokenService: TokenService, private authenticationService: AuthService, private http: HttpClient) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessExpired = this.tokenService.accessTokenExpired(sessionStorage.getItem('token'));
    const refreshExpired = this.tokenService.refreshTokenExpired(sessionStorage.getItem('refresh_token'));
    if (request.url.includes('api/token') ||
        (request.url.includes('token') &&
         sessionStorage.getItem('token') &&
         sessionStorage.getItem('refresh_token') &&
         accessExpired &&
         !refreshExpired)) {
      return next.handle(request);
    }
    let headers = request.headers;
    if (!headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('X-organization', sessionStorage.getItem('x_organization'));
    headers = headers.set('Authorization', 'Bearer ' + this.tokenService.getToken());
    request = request.clone({
                              headers: headers,
                            });
    if (sessionStorage.getItem('refresh_token') && sessionStorage.getItem('token') && accessExpired && refreshExpired) {
      this.authenticationService.logoutUser();
    } else if (accessExpired && !refreshExpired) {
      if (!this.refreshTokenInProgress) {
        this.refreshTokenInProgress = true;
        this.refreshTokenSubject.next(null);
        return this.tokenService.refreshToken().pipe(switchMap((authResponse) => {
          sessionStorage.setItem('token', authResponse.access_token);
          sessionStorage.setItem('refresh_token', authResponse.refresh_token);
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(authResponse.refresh_token);
          return next.handle(this.injectToken(request));
        }));
      } else {
        return this.refreshTokenSubject.pipe(
          filter(result => result !== null),
          take(1),
          switchMap((res) => {
            return next.handle(this.injectToken(request));
          }));
      }
    }
    if (!accessExpired) {
      if (sessionStorage.getItem('token') && !accessExpired) {
        return next.handle(this.injectToken(request));
      }
    }
    return next.handle(request);
  }

  injectToken(request: HttpRequest<any>) {
    const token = this.tokenService.getToken();
    return request.clone({
                           setHeaders: {
                             Authorization: `Bearer ${token}`,
                           },
                         });
  }
}




import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate() {
    if (sessionStorage.getItem('isLoggedIn')) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}

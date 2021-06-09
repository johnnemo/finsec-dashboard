import {Component, OnInit} from '@angular/core';
import {NbLoginComponent} from '@nebular/auth';

@Component({
             selector: 'ngx-login',
             templateUrl: './login.component.html',
           })
export class LoginComponent extends NbLoginComponent implements OnInit {


  ngOnInit(): void {
    this.user.grant_type = 'sdfds';
    this.user.scope = 'dsafsa';
    this.user.client_id = 'dsfsad';
    this.user.client_secret = 'dsfsad';
  }

}

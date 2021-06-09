import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormValidationService} from '../../app/@core/services/shared/form-validation.service';
import {AuthService} from '../../app/@core/services/shared/auth.service';
import * as jwt_decode from 'jwt-decode';
import {HttpClient} from '@angular/common/http';
import {TokenService} from "../../app/@core/services/shared/token.service";

@Component({
             selector: 'app-login',
             templateUrl: './login.component.html',
             styleUrls: ['./login.component.scss'],
           })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string;
  token: string;
  errorMessages: any;
  loginValidationMessages = {
    'username': {
      'required': 'Username is required',
      'minlength': 'Username must be at least 6 characters',
      'maxlength': 'Username must be up to 20 characters',
      'pattern': 'No special characters are permitted',
    },
    'password': {
      'required': 'Password is required',
      'minlength': 'Password must be at least 6 characters',
      'maxlength': 'Password must be up to 30 characters',
      'pattern': 'No special characters are permitted',
    },
  };

  formErrors = {
    'name': '',
    'password': '',
  };

  constructor(private fb: FormBuilder, private http: HttpClient, private authenticationService: AuthService,
              private validationService: FormValidationService, private router: Router, private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.tokenService.getClientSecret().then(result => {
      this.token = result;
    }, error => {

    });
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/pages/dashboard');
    }
    this.loginForm = this.fb.group({
                                     username: [
                                       '', [
                                         Validators.required, Validators.minLength(6), Validators.maxLength(30),
                                         Validators.pattern(/^[a-zA-Z0-9_-]*$/),
                                       ],
                                     ],
                                     password: [
                                       '',
                                       [Validators.required, Validators.minLength(6), Validators.maxLength(30)],
                                     ],
                                     grant_type: [''],
                                     scope: [''],
                                     client_id: [''],
                                     client_secret: [''],
                                   });

    this.loginForm.valueChanges.subscribe((data) => {
      this.validationService.logValidationErrors(this.loginForm, this.formErrors, this.loginValidationMessages);
    });
  }

  setMessage() {
    this.message = 'Logged ' + (this.authenticationService.isLoggedIn ? 'in' : 'out');
  }

  login() {
    const obj = {
      grant_type: 'password',
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      client_id: 'client-finsec',
      client_secret: this.token,
      scope: 'openid',
    };
    this.authenticationService.loginUser(obj)
        .subscribe(
          next => {
            const token = next.access_token;
            if (token) {
              sessionStorage.setItem('isLoggedIn', 'true');
              sessionStorage.setItem('x_organization', jwt_decode(token)['x_organization']);
              sessionStorage.setItem('token', token);
              sessionStorage.setItem('refresh_token', next.refresh_token);
              const redirect = this.authenticationService.redirectUrl;
              this.router.navigateByUrl(redirect);
            } else {
              return false;
            }
          },
          error => {
            this.errorMessages = 'Invalid Credentials. Please try again';
          },
        );
  }

  register() {
  }
}

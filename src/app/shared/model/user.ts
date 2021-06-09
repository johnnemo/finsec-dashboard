export class User {
  constructor(name: string, password: string, email: string, access_token: string) {
    this._name = name;
    this._password = password;
    this._email = email;
    this._access_token = access_token;
  }

  private _name: string;

  set name(value: string) {
    this._name = value;
  }

  private _password: string;

  set password(value: string) {
    this._password = value;
  }

  private _email: string;

  set email(value: string) {
    this._email = value;
  }

  private _access_token: string;

  set access_token(value: string) {
    this._access_token = value;
  }

}

import { Injectable } from '@angular/core';
import { WebService } from './web.service';
import * as moment from "moment";
import { HttpErrorResponse } from '@angular/common/http';

interface AuthReturn {
  token: string;
  expiresInSeconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = sessionStorage.getItem('user')
  token = sessionStorage.getItem('token')
  expiresAt: moment.Moment = moment(sessionStorage.getItem('expiresAt')) //Will have meaningful value when token is not empty string

  constructor(private webService: WebService) {

  }

  async register(username: string, password: string) {
    try {
      const res = await this.webService.post<AuthReturn>('users/register', { "username": username, "password": password }).toPromise();
      this.login(username,password)
      return true
    }
    catch(err) {
      return false
    }
  }

  async login(username: string, password: string) {
    try {
      const res = await this.webService.post<AuthReturn>('users/authenticate', { "username": username, "password": password }).toPromise();
      this.setSession(res,username);
      return true
    }
    catch(err) {
      return false
    }
  }

  private setSession(authReturn: AuthReturn, user: string) {
    sessionStorage.setItem('user',user)
    sessionStorage.setItem('token',authReturn.token);
    sessionStorage.setItem('expiresAt',moment().add(authReturn.expiresInSeconds,'second').format());
    this.token = authReturn.token;
    this.expiresAt = moment().add(authReturn.expiresInSeconds,'second');
    this.user = user;
  }

  logout() {
    sessionStorage.clear()
    this.token = null;
    this.expiresAt = moment(null);
    this.user = null;
  }

  isAuthenticated() {
    return this.token != null && moment() < this.expiresAt
  }
}

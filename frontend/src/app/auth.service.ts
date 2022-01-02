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

  register(username: string, password: string) {
    this.webService.post<AuthReturn>('users/register', { "username": username, "password": password }).subscribe(
      res => {this.login(username,password)},
      (err : HttpErrorResponse) => {err.status});
  }

  login(username: string, password: string) {
    this.webService.post<AuthReturn>('users/authenticate', { "username": username, "password": password }).subscribe(
      res => {this.setSession(res,username)},
      (err : HttpErrorResponse) => {err.status});
  }

  private setSession(authReturn: AuthReturn, user: string) {
    sessionStorage.setItem('user',user)
    sessionStorage.setItem('token',authReturn.token);
    sessionStorage.setItem('expiresAt',moment().add(authReturn.expiresInSeconds,'second').format());
    this.token = authReturn.token;
    this.expiresAt = moment().add(authReturn.expiresInSeconds,'second');
    this.user = user
  }

  logout() {
    this.token = null
  }

  isAuthenticated() {
    return this.token != null && moment() < this.expiresAt
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-entry',
  templateUrl: './login-entry.component.html',
  styleUrls: ['./login-entry.component.css']
})
export class LoginEntryComponent {

  constructor() { }

  getUsername() {
    return (<HTMLInputElement>document.getElementById("username")).value
  }

  getPassword() {
    return (<HTMLInputElement>document.getElementById("password")).value
  }
}

import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.css']
})
export class LoginComponent {

  constructor(public authService: AuthService) {

  }

  login(username: string,password: string) {
    this.authService.login(username,password);
  }
}

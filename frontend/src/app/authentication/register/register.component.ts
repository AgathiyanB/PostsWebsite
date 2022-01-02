import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.css']
})
export class RegisterComponent {

  constructor(public authService: AuthService) {

  }

  register(username: string,password: string) {
    this.authService.register(username,password);
  }
}

import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.css']
})
export class LoginComponent {
  showError = false

  constructor(private router: Router, public authService: AuthService) {
    if(authService.isAuthenticated()) {
      this.router.navigate(['/'])
    }
  }

  login(username: string,password: string) {
    this.authService.login(username,password).then((b) => {
      if(b) {
        this.router.navigate(['/'])
      }
      else {
        this.showError = true
      }
    })
  }
}

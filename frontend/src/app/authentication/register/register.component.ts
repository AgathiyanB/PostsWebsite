import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.css']
})
export class RegisterComponent {
  errorCode = 0 //0 is no error, 1 is empty username, 2 is username taken

  constructor(private router: Router, public authService: AuthService) {
    if(authService.isAuthenticated()) {
      this.router.navigate(['/'])
    }
  }

  register(username: string,password: string) {
    if(username == '') {
      this.errorCode = 1
    }
    else {
      this.authService.register(username,password).then((b) => {
        if(b) {
          this.errorCode = 0
          this.router.navigate(['/'])
        }
        else {
          this.errorCode = 2
        }
      })
    }
  }
}

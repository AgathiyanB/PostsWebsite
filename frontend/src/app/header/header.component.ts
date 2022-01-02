import { Component } from "@angular/core";
import { AuthService } from "../auth.service";

@Component ({
  selector: 'app-header',
  styleUrls: ['header.component.css'],
  templateUrl: './header.component.html'
})

export class HeaderComponent {

  constructor(public authService: AuthService) {

  }

  logout() {
    this.authService.logout();
  }
}

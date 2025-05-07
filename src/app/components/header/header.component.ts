import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.user;

  logoutUser() {
    this.authService.logout();
  }
}

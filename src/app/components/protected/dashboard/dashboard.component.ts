import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  user = this.authService.user;

  logout() {
    this.authService.logout();
  }
}

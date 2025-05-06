import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
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

import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dash-hero',
  imports: [RouterLink],
  templateUrl: './dash-hero.component.html',
  styleUrl: './dash-hero.component.css',
})
export class DashHeroComponent {
  private authService = inject(AuthService);
  user = this.authService.user;
}

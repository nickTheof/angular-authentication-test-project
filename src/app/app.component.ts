import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { ErrorService } from './shared/services/error.service';
import { ErrorModalComponent } from './components/modal/error-modal/error-modal.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private errorService = inject(ErrorService);
  error = this.errorService.error;
}

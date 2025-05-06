import { Component, inject, input } from '@angular/core';
import { ErrorService } from '../../../shared/services/error.service';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-error-modal',
  imports: [ModalComponent],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.css',
})
export class ErrorModalComponent {
  private errorService = inject(ErrorService);
  title = input.required<string>();
  message = input.required<string>();

  onClearError() {
    this.errorService.clearError();
  }
}

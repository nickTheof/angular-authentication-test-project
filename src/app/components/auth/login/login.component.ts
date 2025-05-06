import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ErrorService } from '../../../shared/services/error.service';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginDTO } from '../../../shared/interfaces/dto/loginDTO';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private errorService = inject(ErrorService);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    const loginData: LoginDTO = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };
    this.authService.login(loginData).subscribe({
      next: (resp) => {
        localStorage.setItem('token', resp.data);
        this.router.navigate(['../', 'dashboard'], {
          replaceUrl: true,
        });
      },
      error: (error: Error) => {
        this.form.reset();
        this.errorService.showError(error.message);
      },
    });
  }
}

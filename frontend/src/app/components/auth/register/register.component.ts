import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterUserDTO } from '../../../shared/interfaces/register-user-dto';
import { RegisterService } from '../../../shared/services/register.service';
import { ErrorService } from '../../../shared/services/error.service';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;
    if (val1 === val2) {
      return null;
    } else {
      return { valuesNotEqual: true };
    }
  };
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private registerService = inject(RegisterService);
  private errorService = inject(ErrorService);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    firstname: new FormControl('', {
      validators: [Validators.required],
    }),
    lastname: new FormControl('', {
      validators: [Validators.required],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()]).{8,}$'
            ),
          ],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      {
        validators: [equalValues('password', 'confirmPassword')],
      }
    ),
  });

  onRegister() {
    const newUserDTO: RegisterUserDTO = {
      email: this.form.value.email || '',
      firstname: this.form.value.firstname || '',
      lastname: this.form.value.lastname || '',
      password: this.form.value.passwords?.password || '',
      confirmPassword: this.form.value.passwords?.confirmPassword || '',
    };

    this.registerService.registerUser(newUserDTO).subscribe({
      next: (resp) => {
        this.router.navigate(['../', 'login'], {
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

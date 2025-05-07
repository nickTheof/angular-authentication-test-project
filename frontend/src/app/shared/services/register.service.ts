import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterUserDTO } from '../interfaces/register-user-dto';
import { User } from '../interfaces/currentUser';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private client = inject(HttpClient);

  registerUser(createUserDTO: RegisterUserDTO) {
    return this.client
      .post<{ status: string; data: User }>(
        'http://localhost:3000/api/v1/auth/register',
        createUserDTO
      )
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(err.error.message));
        })
      );
  }
}

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { LoginDTO } from '../interfaces/dto/loginDTO';
import { UserLoggedIn } from '../interfaces/currentUser';
import { LoginResponse } from '../interfaces/loginResponse';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private client = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem('token'));

  readonly user = computed(() => {
    const token = this._token();
    if (token) {
      return jwtDecode<UserLoggedIn>(token);
    }
    return null;
  });

  readonly tokenExpired = computed(() => {
    const token = this._token();
    if (token) {
      return this.isTokenExpired(token);
    }
    return true;
  });

  readonly token = this._token.asReadonly();

  login(loginData: LoginDTO) {
    return this.client
      .post<LoginResponse>('http://localhost:3000/api/v1/auth/login', loginData)
      .pipe(
        tap((resp) => {
          localStorage.setItem('token', resp.data);
          this._token.set(resp.data);
        }),
        catchError((err) => {
          return throwError(() => new Error(err.error.message));
        })
      );
  }

  logout() {
    this.clearCredentials();
    this.router.navigate(['/login'], {
      replaceUrl: true,
    });
  }

  isTokenExpired(token: string): boolean {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 < Date.now();
  }

  clearCredentials() {
    localStorage.removeItem('token');
    this._token.set(null);
  }
}

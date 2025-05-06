import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { ErrorService } from './error.service';
import { LoginDTO } from '../interfaces/dto/loginDTO';
import { CurrentUser, GetCurrentUserResponse } from '../interfaces/currentUser';
import { LoginResponse } from '../interfaces/loginResponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private client = inject(HttpClient);
  private errorService = inject(ErrorService);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem('token'));
  private _user = signal<CurrentUser | null>(null);
  private _lastFetched = signal<number | null>(null);

  token = this._token.asReadonly();
  user = this._user.asReadonly();

  login(loginData: LoginDTO) {
    return this.client
      .post<LoginResponse>('http://localhost:3000/api/v1/auth/login', loginData)
      .pipe(
        tap((resp) => {
          localStorage.setItem('token', resp.data);
          this._token.set(resp.data);
        }),
        catchError(() => {
          this.errorService.showError('Failed to login.');
          return throwError(() => new Error('Failed to login'));
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login'], {
      replaceUrl: true,
    });
  }

  getToken(): string | null {
    return this._token();
  }

  getCurrentUser() {
    return this.client
      .get<GetCurrentUserResponse>('http://localhost:3000/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${this._token()}`,
        },
      })
      .pipe(
        tap((resp) => {
          this._user.set(resp.data);
          this._lastFetched.set(Date.now());
        })
      );
  }

  getLastFetched(): number | null {
    return this._lastFetched();
  }
}

export const isAuthenticatedGuard: CanMatchFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const errorService = inject(ErrorService);

  const token = authService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return of(false);
  }

  const lastFetched = authService.getLastFetched();

  // Only proceed if lastFetched is not null and within the 1-hour window
  if (
    authService.user() &&
    lastFetched &&
    Date.now() - lastFetched < 3_600_000 // 1 hour
  ) {
    return of(true);
  }

  return authService.getCurrentUser().pipe(
    map(() => true),
    catchError(() => {
      authService.logout();
      errorService.showError('Failed authentication. Please login again.');
      return of(router.createUrlTree(['/login']));
    })
  );
};

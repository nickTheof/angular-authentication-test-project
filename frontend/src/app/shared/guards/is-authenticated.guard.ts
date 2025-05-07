import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';
import { catchError, map, of } from 'rxjs';

export const isAuthenticatedGuard: CanMatchFn = (route, segments) => {
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

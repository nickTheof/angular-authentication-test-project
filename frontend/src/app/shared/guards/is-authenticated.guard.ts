import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token();

  if (token && !authService.isTokenExpired(token)) {
    return true;
  }

  authService.clearCredentials();
  router.navigate(['/login'], {
    replaceUrl: true,
  });
  return false;
};

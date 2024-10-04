import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/api';
import { catchError, map, of } from 'rxjs';

export const portalGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authApi = inject(AuthService);
  const auth = localStorage.getItem('auth');

  if (!auth) {
    router.navigate(['auth', 'login']);
    return false;
  }

  return authApi.me().pipe(
    map((response) => {
      return true;
    }),
    catchError((error) => {
      localStorage.removeItem('auth');
      router.navigate(['auth', 'login']);
      return of(false);
    })
  );
};

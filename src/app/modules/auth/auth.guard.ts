import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/api';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authApi = inject(AuthService);
  const auth = localStorage.getItem('auth');

  if (!auth) {
    return true;
  }

  return authApi.me().pipe(
    map((response) => {
      router.navigate(['portal']);
      return false;
    }),
    catchError((error) => {
      localStorage.removeItem('auth');
      return of(true);
    })
  );
};

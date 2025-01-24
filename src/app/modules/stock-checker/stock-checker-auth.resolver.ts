import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '@app/shared/services/api';
import { catchError, map, of } from 'rxjs';

export const stockCheckerAuthResolver: ResolveFn<boolean> = (route, state) => {
  const authApi = inject(AuthService);
  const auth = localStorage.getItem('auth');

  if (!auth) {
    return false;
  }

  return authApi.me().pipe(
    map((user) => !!user),
    catchError(() => of(false)),
  );
};

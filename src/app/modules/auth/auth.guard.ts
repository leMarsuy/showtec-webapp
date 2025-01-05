import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { UserActions } from '@app/core/states/user';
import { AuthService } from '@app/shared/services/api';
import { Store } from '@ngrx/store';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);
  const authApi = inject(AuthService);
  const auth = localStorage.getItem('auth');

  if (!auth) {
    return true;
  }

  return authApi.me().pipe(
    map((response) => {
      store.dispatch(UserActions.setUser(response));
      router.navigate([PORTAL_PATHS.baseUrl]);
      return false;
    }),
    catchError((error) => {
      localStorage.removeItem('auth');
      return of(true);
    }),
  );
};

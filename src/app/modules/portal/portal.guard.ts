import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserActions } from '@app/core/states/user';
import { AuthService } from '@app/shared/services/api';
import { Store } from '@ngrx/store';
import { catchError, map, of } from 'rxjs';

export const portalGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authApi = inject(AuthService);
  const store = inject(Store);
  const auth = localStorage.getItem('auth');

  if (!auth) {
    router.navigate(['auth', 'login']);
    return false;
  }

  return authApi.me().pipe(
    map((response) => {
      store.dispatch(UserActions.setUser(response));
      return true;
    }),
    catchError((error) => {
      store.dispatch(UserActions.removeUser({}));
      localStorage.removeItem('auth');
      router.navigate(['auth', 'login']);
      return of(false);
    }),
  );
};

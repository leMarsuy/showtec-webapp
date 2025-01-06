import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { Status } from '@app/core/enums/status.enum';
import { UserActions } from '@app/core/states/user';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';
import { Store } from '@ngrx/store';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);
  const authApi = inject(AuthService);
  const snackbar = inject(SnackbarService);
  const auth = localStorage.getItem('auth');

  const removeCachedUser = () => {
    store.dispatch(UserActions.removeUser({}));
    localStorage.removeItem('auth');
  };

  if (!auth) {
    return true;
  }

  return authApi.me().pipe(
    map((response) => {
      if (response.status !== Status.ACTIVE) {
        snackbar.openErrorSnackbar(
          `Access Denied`,
          `Your account is not active. Please contact your Administrator.`,
          { duration: 3000 },
        );
        removeCachedUser();
        return true;
      }

      if (!response.permissions?.length) {
        snackbar.openErrorSnackbar(
          `Access Denied`,
          `You do not have any permissions granted for access. Please contact your Administrator.`,
          { duration: 3000 },
        );
        removeCachedUser();
        return true;
      }

      store.dispatch(UserActions.setUser(response));
      router.navigate([PORTAL_PATHS.baseUrl]);
      return false;
    }),
    catchError((error) => {
      removeCachedUser();
      return of(true);
    }),
  );
};

import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
} from '@angular/router';
import { AUTH_PATHS, PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { selectUserPermissions, UserActions } from '@app/core/states/user';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';
import { Store } from '@ngrx/store';
import { catchError, map, of } from 'rxjs';

export const portalGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authApi = inject(AuthService);
  const store = inject(Store);
  const snackbar = inject(SnackbarService);
  const auth = localStorage.getItem('auth');

  if (!auth) {
    router.navigate([AUTH_PATHS.login.relativeUrl]);
    return false;
  }

  return authApi.me().pipe(
    map((response) => {
      store.dispatch(UserActions.setUser(response));

      if (!response.permissions?.length) {
        snackbar.openErrorSnackbar(
          `Access Denied`,
          `You do not have any permissions granted for access. Please contact your Administrator.`,
          { duration: 3000 },
        );
        store.dispatch(UserActions.removeUser({}));
        localStorage.removeItem('auth');
        router.navigate([AUTH_PATHS.login.relativeUrl]);
        return false;
      }

      return true;
    }),
    catchError((error) => {
      store.dispatch(UserActions.removeUser({}));
      localStorage.removeItem('auth');
      router.navigate([AUTH_PATHS.login.relativeUrl]);
      return of(false);
    }),
  );
};

export const roleGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state,
) => {
  const router = inject(Router);
  const store = inject(Store);

  if (!route.url[0]) {
    return true;
  }

  const url = state.url.split('/')[2];

  return store.select(selectUserPermissions()).pipe(
    map((userPermission) => {
      const permission = userPermission?.find(
        (permission) => permission.path === url,
      );

      const hasAccess = permission?.hasAccess;
      if (!hasAccess) {
        const firstPermission = userPermission?.find(
          (permission) => permission.hasAccess,
        );
        router.navigate([PORTAL_PATHS.baseUrl, firstPermission?.path]);
      }

      return !!permission?.hasAccess;
    }),
  );
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PORTAL_PATHS, RELEASING_PATHS } from '@app/core/constants/nav-paths';
import { Status } from '@app/core/enums/status.enum';
import { UserType } from '@app/core/enums/user-type.enum';
import { UserActions } from '@app/core/states/user';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';
import { Store } from '@ngrx/store';
import { catchError, map, of } from 'rxjs';

export const outDeliveryReleasingPortalGuard: CanActivateFn = (
  route,
  state,
) => {
  const router = inject(Router);
  const authApi = inject(AuthService);
  const store = inject(Store);
  const snackbar = inject(SnackbarService);
  const auth = localStorage.getItem('auth');

  const redirectUserToPortal = () => {
    router.navigate([PORTAL_PATHS.baseUrl]);
    return false;
  };

  const forceLogoutUser = () => {
    store.dispatch(UserActions.removeUser({}));
    localStorage.removeItem('auth');
    router.navigate([RELEASING_PATHS.auth.relativeUrl]);
  };

  const redirectUserToReleasingAuth = () => {
    router.navigate([RELEASING_PATHS.auth.relativeUrl]);
    return false;
  };

  if (!auth) {
    redirectUserToReleasingAuth();
  }

  return authApi.me().pipe(
    map((response) => {
      store.dispatch(UserActions.setUser(response));

      if (response.status !== Status.ACTIVE) {
        snackbar.openErrorSnackbar(
          `Access Denied`,
          `Your account is not active. Please contact your Administrator.`,
          { duration: 3000 },
        );
        forceLogoutUser();
        return false;
      }

      //Bypass guard if userType === 'Admin'
      if (response.userType === UserType.ADMIN) {
        return true;
      }

      if (!response.permissions?.length) {
        snackbar.openErrorSnackbar(
          `Access Denied`,
          `You do not have any permissions granted for access. Please contact your Administrator.`,
          { duration: 3000 },
        );
        forceLogoutUser();
        return false;
      }

      const releasingPermission = response.permissions.find(
        (permission) => permission.path === '/releasing',
      );

      if (!releasingPermission || !releasingPermission.hasAccess) {
        redirectUserToPortal();
        return false;
      }

      return true;
    }),
    catchError((error) => {
      forceLogoutUser();
      return of(false);
    }),
  );
};

export const outDeliveryReleasingAuthGuard: CanActivateFn = (route, state) => {
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
          `Something is wrong with your account. Please contact your Administrator.`,
          { duration: 3000 },
        );
        removeCachedUser();
        return true;
      }

      if (!response.permissions?.length) {
        snackbar.openErrorSnackbar(
          `Access Denied`,
          `Something is wrong with your account. Please contact your Administrator.`,
          { duration: 3000 },
        );
        removeCachedUser();
        return true;
      }

      const releasingPermission = response.permissions.find(
        (permission) => permission.path === `/${RELEASING_PATHS.baseUrl}`,
      );

      if (!releasingPermission || !releasingPermission.hasAccess) {
        snackbar.openErrorSnackbar(`Access Denied`, `Permission required`, {
          duration: 3000,
        });
        return true;
      }

      store.dispatch(UserActions.setUser(response));
      router.navigate([RELEASING_PATHS.portal.relativeUrl]);
      return false;
    }),
    catchError((error) => {
      removeCachedUser();
      return of(true);
    }),
  );
};

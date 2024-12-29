import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { selectUserPermissions, UserActions } from '@app/core/states/user';
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

      if (!response.permissions?.length) {
        router.navigate(['auth', 'login']);
        //popup alert
        
        store.dispatch(UserActions.removeUser({}));
        localStorage.removeItem('auth');
        return false;
      }

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

export const roleGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state,
) => {
  const router = inject(Router);
  const store = inject(Store);

  if(!route.url[0]) {
    return true;
  }

  const url = state.url.split('/')[2];

  return store.select(selectUserPermissions()).pipe(map((userPermission) => {
    const permission = userPermission?.find((permission) => permission.path === url);

    const hasAccess = permission?.hasAccess;
    if (!hasAccess) {
      const firstPermission = userPermission?.find((permission) => permission.hasAccess); 
      router.navigate(['portal', firstPermission?.path]);
    }

    return !!permission?.hasAccess;
  }))

}

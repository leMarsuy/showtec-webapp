import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { EXCLUDED_PATHS, PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { UserType } from '@app/core/enums/user-type.enum';
import { Permission } from '@app/core/models/role.model';
import { selectUser, selectUserPermissions } from '@app/core/states/user';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';

export const settingsChildGuard: CanActivateChildFn = (childRoute, state) => {
  const store = inject(Store);
  const router = inject(Router);

  //Settings Child Path
  const parentUrl = state.url.split('/')[2];
  const childUrlPath = state.url.split('/')[3];

  const getFirstPermissionHasAccess = (permissions: any) => {
    return permissions.find(
      (permission: any) =>
        permission.hasAccess && !EXCLUDED_PATHS.includes(permission.path),
    );
  };

  return combineLatest([
    store.select(selectUser()),
    store.select(selectUserPermissions()),
  ]).pipe(
    take(1),
    map(([user, userPermission]) => {
      //Bypass guard if userType === 'Admin'
      if (user.userType === UserType.ADMIN) {
        return true;
      }

      //Find Settings permissions in User permissions
      const settingsPermission: any = userPermission?.find(
        (permission) => permission.path === parentUrl,
      );

      //If not found, return the user on his/her first found permission that has access
      if (!settingsPermission) {
        const findFirstPermission = getFirstPermissionHasAccess(userPermission);
        router.navigate([PORTAL_PATHS.baseUrl, findFirstPermission?.path]);
        return false;
      }

      // If user has settings permissions, find the current child url path in the found settings permissions
      const childPermission = settingsPermission.children?.find(
        (permission: Permission) => permission.path === childUrlPath,
      );

      const hasChildAccess = childPermission?.hasAccess;

      if (!hasChildAccess) {
        const firstSettingPermission = getFirstPermissionHasAccess(
          settingsPermission.children,
        );
        router.navigate([
          PORTAL_PATHS.baseUrl,
          parentUrl,
          firstSettingPermission?.path,
        ]);
      }

      return !!hasChildAccess;
    }),
  );
};

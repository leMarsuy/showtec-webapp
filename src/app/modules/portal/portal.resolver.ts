import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Config } from '@app/core/models/config.model';
import { PortalNavigationActions } from '@app/core/states/portal-navigations';
import { selectUser } from '@app/core/states/user';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { Store } from '@ngrx/store';
import { combineLatest, map, take, tap } from 'rxjs';

export const portalResolver: ResolveFn<unknown> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const config = inject(ConfigApiService);
  const store = inject(Store);

  const obs = combineLatest({
    user: store.select(selectUser()),
    portalConfig: config.getPortalConfig().pipe(
      tap((response) => {
        const config = response as Config;
        store.dispatch(
          PortalNavigationActions.setPortalNavigationConfig(config),
        );
      }),
    ),
  });

  const filterRoutes = (routes: any, permissionMap: any) => {
    return routes.filter((route: any) => permissionMap[route.path].hasAccess);
  };

  return obs.pipe(
    take(1),
    map(({ user, portalConfig }) => {
      const permissionMap = user.permissions?.reduce(
        (acc: any, permission: any) => {
          acc[permission.path] = {
            hasAccess: permission.hasAccess,
          };

          if (permission?.children?.length) {
            const children: any = {};
            permission.children.forEach((child: any, index: number) => {
              children[child.path] = { hasAccess: child.hasAccess };
            });
            acc[permission.path]['children'] = children;
          }
          return acc;
        },
        {},
      );

      const conf = JSON.parse(JSON.stringify(portalConfig)) as any;

      let navigations = conf.data.navigations;

      /**
       *  navigations[] can results to (navigation or navGroup).items.length = 0, so we filter it out after iteration
       */
      navigations.forEach((navigation: any, index: number) => {
        navigation.items = navigation.items.filter((item: any) => {
          if (item.items && permissionMap[item.path].hasAccess) {
            item.items = filterRoutes(
              item.items,
              permissionMap[item.path]['children'],
            );
          }
          return permissionMap[item.path].hasAccess;
        });
      });

      navigations = navigations.filter(
        (navGroup: any) => navGroup.items.length,
      );

      return conf;
    }),
  );
};

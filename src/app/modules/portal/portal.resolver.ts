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

  /**
   * #NOTE: There's a ghost bug where on some accounts, data.navigations is not complete/late so the permission mapping is broken
   * Maybe create the permission mapping in sidenav component?
   */

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

      const navigations = conf.data.navigations;

      navigations.forEach((navigation: any, index: number) => {
        const newItems: any = [];
        navigation.items.forEach((route: any) => {
          if (route?.items?.length) {
            route.items = route.items.filter((child: any) => {
              return permissionMap[route.path]['children'][child.path]
                .hasAccess;
            });
          }

          if (permissionMap[route.path].hasAccess) {
            newItems.push(route);
          }
        });

        navigation.items = newItems;
        if (!navigation.items.length) {
          navigations.splice(index, 1);
        }
      });

      return conf;
    }),
  );
};

import { Component, inject, Input, OnDestroy } from '@angular/core';
import { EXCLUDED_PATHS } from '@app/core/constants/nav-paths';
import { UserType } from '@app/core/enums/user-type.enum';
import { NAV_ROUTES, NavRoute } from '@app/core/lists/nav-routes.list';
import { selectUser, selectUserPermissions } from '@app/core/states/user';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnDestroy {
  private readonly store = inject(Store);

  navList = NAV_ROUTES;
  @Input() expanded!: Boolean;

  private readonly adminPermissions = NAV_ROUTES.reduce(
    (acc: Record<string, string | boolean>[], routeGroup) => {
      const paths = routeGroup.items.flatMap((route: NavRoute) => {
        if (EXCLUDED_PATHS.includes(route.path)) return [];
        return [{ path: route.path, hasAccess: true }];
      }, []);
      return [...acc, ...paths];
    },
    [],
  );

  permissionPathMap: Record<string, boolean> = {};
  navGroupState: Record<string, boolean> = {};

  // check development mode
  isDeveloperMode = environment.ENVIRONMENT_NAME === 'development';

  private _destroyed$ = new Subject<void>();

  constructor() {
    combineLatest([
      this.store.select(selectUser()),
      this.store.select(selectUserPermissions()),
    ])
      .pipe(
        map(([user, permissions]) => ({ details: user, permissions })),
        takeUntil(this._destroyed$),
      )
      .subscribe((user) => {
        if (user.details.userType === UserType.ADMIN) {
          this._setPermissionPathMap(this.adminPermissions);
          this._setNavGroupState();
          return;
        }

        if (user.permissions) {
          this._setPermissionPathMap(user.permissions);
          this._setNavGroupState();
        }
      });
  }

  private _setPermissionPathMap(permissions: any) {
    const remapped = permissions;

    this.permissionPathMap = remapped.reduce(
      (acc: any, permission: any) => {
        acc[permission.path] = permission.hasAccess;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    for (const excludedPath of EXCLUDED_PATHS) {
      this.permissionPathMap[excludedPath] = true;
    }
  }

  private _setNavGroupState() {
    this.navGroupState = this.navList.reduce(
      (acc, navGroup) => {
        acc[navGroup.group] = navGroup.items.some(
          (navItem) => this.permissionPathMap[navItem.path],
        );
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

import { Component, inject, Input, OnDestroy } from '@angular/core';
import { EXCLUDED_PATHS } from '@app/core/constants/nav-excluded-paths';
import { NAV_ROUTES } from '@app/core/lists/nav-routes.list';
import { selectUserPermissions } from '@app/core/states/user';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly excludedPaths = EXCLUDED_PATHS;


  navList = NAV_ROUTES;
  @Input() expanded!: Boolean;

  permissionPathMap: Record<string, boolean> = {};
  navGroupState: Record<string, boolean> = {};

  // check development mode
  isDeveloperMode = environment.ENVIRONMENT_NAME === 'development';
  
  private _destroyed$ = new Subject<void>();

  constructor() {
    this.store.select(selectUserPermissions()).pipe(takeUntil(this._destroyed$)).subscribe((permissions) => {
      if (permissions) {
        this.permissionPathMap = permissions?.reduce((acc, permission) => {
          acc[permission.path] = permission.hasAccess;
          return acc
        }
        , {} as Record<string, boolean>);

        for (const excludedPath of EXCLUDED_PATHS) {
          this.permissionPathMap[excludedPath] = true;
        }

        this.navGroupState = this.navList.reduce((acc, navGroup) => {
          acc[navGroup.group] = navGroup.items.some(navItem => this.permissionPathMap[navItem.path]);
          return acc;
        }, {} as Record<string, boolean>);
      }
    });
    
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  // private _formatNavList(permissions: Permission[]) {
  //   let remapped = [];
  //   for(const navRouteGroup of NAV_ROUTES) {

  //     let items = [];
  //     for(const navRoute of navRouteGroup.items) {

  //       //Check if navRoute.path is in excluded paths that skips user has access verification
  //       if(this.excludedPaths.includes(navRoute.path)) {
  //         items.push(navRoute);
  //         continue;
  //       }

  //       //Check user permission
  //       const permission = permissions.filter((item: any) => item.path === navRoute.path)[0];
  //       if(!permission.hasAccess) {
  //         continue;
  //       } 
  //         items.push(navRoute);
  //     }

  //     if(items.length === 0) {
  //       continue;
  //     }

  //     remapped.push({
  //       group: navRouteGroup.group,
  //       items
  //     })
  //   }

  //   return remapped;
  // }

}

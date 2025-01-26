import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, tap } from 'rxjs';
import { PortalService } from '../../portal.service';

interface SettingRouteConfig {
  label: string;
  route: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnDestroy {
  routeConfigs!: SettingRouteConfig[];
  selectedRoute!: string;

  private destroyed$ = new Subject<void>();

  constructor(
    private portalService: PortalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.portalService.portalNavigation$
      .pipe(
        take(1),
        tap((navigations) => this._setRouteConfigs(navigations)),
      )
      .subscribe({
        next: () => {
          this.selectedRoute = this.router.url;
        },
      });
  }

  private _setRouteConfigs(navigations: any) {
    let settingNavigation: any;
    navigations.forEach((navigation: any) => {
      const finder = navigation.items.find((a: any) => a.path === 'settings');
      if (finder) {
        settingNavigation = finder;
        return;
      }
    });

    this.routeConfigs = settingNavigation?.items.map((childRoute: any) => ({
      label: childRoute.name,
      route: `/portal/${childRoute.parentPath}/${childRoute.path}`,
    }));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

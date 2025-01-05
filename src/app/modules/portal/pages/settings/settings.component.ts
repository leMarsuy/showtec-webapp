import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';

interface SettingRouteConfig {
  label: string;
  route: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private readonly router = inject(Router);

  routeConfigs: SettingRouteConfig[] = [
    {
      label: 'Your Account',
      route: `/${PORTAL_PATHS.settings.account.relativeUrl}`,
    },
    {
      label: 'Products',
      route: `/${PORTAL_PATHS.settings.product.relativeUrl}`,
    },
    {
      label: 'Vouchers',
      route: `/${PORTAL_PATHS.settings.voucher.relativeUrl}`,
    },
  ];
  selectedRoute = this.routeConfigs[0];

  navigateTo(config: SettingRouteConfig) {
    this.selectedRoute = config;
    this.router.navigate([config.route]);
  }
}

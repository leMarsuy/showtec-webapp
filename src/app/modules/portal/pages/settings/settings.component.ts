import { Component, inject } from '@angular/core';
import { ProductSettingsComponent } from './pages/product-settings/product-settings.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { VoucherSettingsComponent } from './pages/voucher-settings/voucher-settings.component';
import { Router } from '@angular/router';

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
  private readonly baseUrl = '/portal/settings';

  routeConfigs: SettingRouteConfig[] = [
    {
      label: 'Your Account',
      route: this.baseUrl + '/account',
    },
    // {
    //   label: 'Products',
    //   route: this.baseUrl + '/product',
    // },
    {
      label: 'Vouchers',
      route: this.baseUrl + '/voucher',
    },
  ];
  selectedRoute = this.routeConfigs[0];

  navigateTo(config: SettingRouteConfig) {
    this.selectedRoute = config;
    this.router.navigate([config.route]);
  }
}

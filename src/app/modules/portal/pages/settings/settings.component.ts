import { Component } from '@angular/core';
import { ProductSettingsComponent } from './pages/product-settings/product-settings.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  settingComponents = [
    {
      label: 'Account Settings',
      component: AccountSettingsComponent,
    },
    {
      label: 'Product Settings',
      component: ProductSettingsComponent,
    },
  ];

  selectedPortal = this.settingComponents[0];
}

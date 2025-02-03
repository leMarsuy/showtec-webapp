import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PortalModule } from '@angular/cdk/portal';
import { MatTabsModule } from '@angular/material/tabs';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { AccountSettingsModule } from './pages/account-settings/account-settings.module';
import { ProductSettingsModule } from './pages/product-settings/product-settings.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ContentHeaderModule,
    PortalModule,
    AccountSettingsModule,
    ProductSettingsModule,
    MatTabsModule,
  ],
  exports: [SettingsComponent],
})
export class SettingsModule {}

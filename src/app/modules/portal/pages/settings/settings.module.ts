import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { PortalModule } from '@angular/cdk/portal';
import { AccountSettingsModule } from './pages/account-settings/account-settings.module';
import { ProductSettingsModule } from './pages/product-settings/product-settings.module';
@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ContentHeaderModule,
    PortalModule,
    AccountSettingsModule,
    ProductSettingsModule,
  ],
  exports: [SettingsComponent],
})
export class SettingsModule {}

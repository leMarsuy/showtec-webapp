import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductSettingsRoutingModule } from './product-settings-routing.module';
import { ProductSettingsComponent } from './product-settings.component';

@NgModule({
  declarations: [ProductSettingsComponent],
  imports: [CommonModule, ProductSettingsRoutingModule],
  exports: [ProductSettingsComponent],
})
export class ProductSettingsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductSettingsRoutingModule } from './product-settings-routing.module';
import { ProductSettingsComponent } from './product-settings.component';
import { ProductClassificationSettingsModule } from './product-classification-settings/product-classification-settings.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ProductSettingsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ProductSettingsRoutingModule,
    ProductClassificationSettingsModule,
  ],
  exports: [ProductSettingsComponent],
})
export class ProductSettingsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductClassificationSettingsComponent } from './product-classification-settings.component';
import { UpsertProductClassificationComponent } from './upsert-product-classification/upsert-product-classification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ProductClassificationSettingsComponent,
    UpsertProductClassificationComponent,
  ],
  exports: [
    ProductClassificationSettingsComponent,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  imports: [CommonModule],
})
export class ProductClassificationSettingsModule {}

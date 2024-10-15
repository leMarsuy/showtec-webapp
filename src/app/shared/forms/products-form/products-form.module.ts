import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsFormComponent } from './products-form.component';
import { TableModule } from '@app/shared/components/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [ProductsFormComponent],
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
  ],
  exports: [ProductsFormComponent],
})
export class ProductsFormModule {}

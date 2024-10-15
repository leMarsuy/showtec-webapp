import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxesFormComponent } from './taxes-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableModule } from '@app/shared/components/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [TaxesFormComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TableModule,
    ReactiveFormsModule,
  ],
  exports: [TaxesFormComponent],
})
export class TaxesFormModule {}

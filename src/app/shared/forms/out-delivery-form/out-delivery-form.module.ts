import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutDeliveryFormComponent } from './out-delivery-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationModule } from '../../components/confirmation/confirmation.module';
import { TableModule } from '../../components/table/table.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [OutDeliveryFormComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    TableModule,
    ConfirmationModule,
    MatDialogModule,
  ],
  exports: [OutDeliveryFormComponent],
})
export class OutDeliveryFormModule {}

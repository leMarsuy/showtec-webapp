import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateOutDeliveryRoutingModule } from './create-out-delivery-routing.module';
import { CreateOutDeliveryComponent } from './create-out-delivery.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [CreateOutDeliveryComponent],
  imports: [
    CommonModule,
    CreateOutDeliveryRoutingModule,
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
  ],
})
export class CreateOutDeliveryModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PopConfirmDirective } from '@app/shared/directives/pop-confirm/pop-confirm.directive';
import { CustomerFormModule } from '@app/shared/forms/customer-form/customer-form.module';
import { AddNewCustomerComponent } from './add-new-customer.component';

@NgModule({
  declarations: [AddNewCustomerComponent],
  exports: [AddNewCustomerComponent],
  imports: [
    CommonModule,
    CustomerFormModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    PopConfirmDirective,
  ],
})
export class AddNewCustomerModule {}

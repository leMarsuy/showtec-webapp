import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomerFormModule } from '@app/shared/forms/customer-form/customer-form.module';
import { AddNewCustomerComponent } from './add-new-customer.component';

@NgModule({
  declarations: [AddNewCustomerComponent],
  exports: [AddNewCustomerComponent],
  imports: [CommonModule, CustomerFormModule, MatDialogModule, MatButtonModule],
})
export class AddNewCustomerModule {}

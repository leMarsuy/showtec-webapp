import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { AddCustomerComponent } from './add-customer/add-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { TableModule } from '@shared/components/table/table.module';
import { ContentHeaderModule } from '@shared/components/content-header/content-header.module';
import { MatSelectModule } from '@angular/material/select';
import { CustomerFormModule } from '@app/shared/forms/customer-form/customer-form.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    CustomersComponent,
    AddCustomerComponent,
    EditCustomerComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    //
    TableModule,
    ContentHeaderModule,
    CustomerFormModule,
    MatMenuModule,
  ],
})
export class CustomersModule {}

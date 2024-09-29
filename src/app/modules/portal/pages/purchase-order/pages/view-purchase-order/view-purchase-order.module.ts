import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewPurchaseOrderRoutingModule } from './view-purchase-order-routing.module';
import { ViewPurchaseOrderComponent } from './view-purchase-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { AddPaymentComponent } from './components/add-payment/add-payment.component';
import { UpdatePaymentComponent } from './components/update-payment/update-payment.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    ViewPurchaseOrderComponent,
    AddPaymentComponent,
    UpdatePaymentComponent,
  ],
  imports: [
    CommonModule,
    ViewPurchaseOrderRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDividerModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  exports: [ViewPurchaseOrderComponent],
})
export class ViewPurchaseOrderModule {}

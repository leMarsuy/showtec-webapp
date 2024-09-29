import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrdersListRoutingModule } from './purchase-orders-list-routing.module';
import { PurchaseOrdersListComponent } from './purchase-orders-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TableModule } from '@app/shared/components/table/table.module';

@NgModule({
  declarations: [PurchaseOrdersListComponent],
  imports: [
    CommonModule,
    PurchaseOrdersListRoutingModule,
    TableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  exports: [PurchaseOrdersListComponent],
})
export class PurchaseOrdersListModule {}

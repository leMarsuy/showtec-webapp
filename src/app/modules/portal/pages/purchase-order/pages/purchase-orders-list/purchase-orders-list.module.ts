import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DateFilterInputModule } from '@app/shared/components/date-filter-input/date-filter-input.module';
import { TableModule } from '@app/shared/components/table/table.module';
import { AddDeliveryReceiptsComponent } from './components/add-delivery-receipts/add-delivery-receipts.component';
import { PurchaseOrdersListRoutingModule } from './purchase-orders-list-routing.module';
import { PurchaseOrdersListComponent } from './purchase-orders-list.component';

@NgModule({
  declarations: [PurchaseOrdersListComponent, AddDeliveryReceiptsComponent],
  imports: [
    CommonModule,
    PurchaseOrdersListRoutingModule,
    TableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule,
    ReactiveFormsModule,
    DateFilterInputModule,
    AsyncPipe,
  ],
  exports: [PurchaseOrdersListComponent],
})
export class PurchaseOrdersListModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpsertPurchaseOrderRoutingModule } from './upsert-purchase-order-routing.module';
import { UpsertPurchaseOrderComponent } from './upsert-purchase-order.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TableModule } from '@app/shared/components/table/table.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsFormComponent } from './components/products-form/products-form.component';
import { TaxesFormComponent } from './components/taxes-form/taxes-form.component';
import { DiscountsFormComponent } from './components/discounts-form/discounts-form.component';
import { SignatoriesFormComponent } from './components/signatories-form/signatories-form.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { TotalSummaryDisplayComponent } from './components/total-summary-display/total-summary-display.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    UpsertPurchaseOrderComponent,
    ProductsFormComponent,
    TaxesFormComponent,
    DiscountsFormComponent,
    SignatoriesFormComponent,
    CustomerFormComponent,
    TotalSummaryDisplayComponent,
  ],
  imports: [
    CommonModule,
    UpsertPurchaseOrderRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    TableModule,
    ReactiveFormsModule,
  ],
  exports: [UpsertPurchaseOrderComponent],
})
export class UpsertPurchaseOrderModule {}

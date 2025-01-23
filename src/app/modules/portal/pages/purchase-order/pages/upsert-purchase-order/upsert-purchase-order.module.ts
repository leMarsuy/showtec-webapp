import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CdkMenuModule } from '@angular/cdk/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TotalSummaryDisplayModule } from '@app/shared/components/total-summary-display/total-summary-display.module';
import { AttachCustomerFormModule } from '@app/shared/forms/attach-customer-form/attach-customer-form.module';
import { DiscountsFormModule } from '@app/shared/forms/discounts-form/discounts-form.module';
import { ProductsFormModule } from '@app/shared/forms/products-form/products-form.module';
import { SignatoriesFormModule } from '@app/shared/forms/signatories-form/signatories-form.module';
import { TaxesFormModule } from '@app/shared/forms/taxes-form/taxes-form.module';
import { UpsertPurchaseOrderRoutingModule } from './upsert-purchase-order-routing.module';
import { UpsertPurchaseOrderComponent } from './upsert-purchase-order.component';
@NgModule({
  declarations: [UpsertPurchaseOrderComponent],
  imports: [
    CommonModule,
    UpsertPurchaseOrderRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    CdkMenuModule,
    MatTooltipModule,
    TotalSummaryDisplayModule,
    AttachCustomerFormModule,
    TaxesFormModule,
    DiscountsFormModule,
    SignatoriesFormModule,
    ProductsFormModule,
    ReactiveFormsModule,
  ],
  exports: [UpsertPurchaseOrderComponent],
})
export class UpsertPurchaseOrderModule {}

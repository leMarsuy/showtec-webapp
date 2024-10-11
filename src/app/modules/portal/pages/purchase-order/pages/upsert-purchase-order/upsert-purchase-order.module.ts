import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpsertPurchaseOrderRoutingModule } from './upsert-purchase-order-routing.module';
import { UpsertPurchaseOrderComponent } from './upsert-purchase-order.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaxesFormModule } from '@app/shared/forms/taxes-form/taxes-form.module';
import { DiscountsFormModule } from '@app/shared/forms/discounts-form/discounts-form.module';
import { SignatoriesFormModule } from '@app/shared/forms/signatories-form/signatories-form.module';
import { ProductsFormModule } from '@app/shared/forms/products-form/products-form.module';
import { TotalSummaryDisplayModule } from '@app/shared/components/total-summary-display/total-summary-display.module';
import { CdkMenuModule } from '@angular/cdk/menu';
import { AttachCustomerFormModule } from '@app/shared/forms/attach-customer-form/attach-customer-form.module';
@NgModule({
  declarations: [UpsertPurchaseOrderComponent],
  imports: [
    CommonModule,
    UpsertPurchaseOrderRoutingModule,
    MatIconModule,
    MatButtonModule,
    CdkMenuModule,
    MatTooltipModule,
    TotalSummaryDisplayModule,
    AttachCustomerFormModule,
    TaxesFormModule,
    DiscountsFormModule,
    SignatoriesFormModule,
    ProductsFormModule,
  ],
  exports: [UpsertPurchaseOrderComponent],
})
export class UpsertPurchaseOrderModule {}

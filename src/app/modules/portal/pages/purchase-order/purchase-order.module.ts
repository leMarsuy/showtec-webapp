import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { UpsertPurchaseOrderModule } from './pages/upsert-purchase-order/upsert-purchase-order.module';
import { PurchaseOrdersListModule } from './pages/purchase-orders-list/purchase-orders-list.module';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { ViewPurchaseOrderModule } from './pages/view-purchase-order/view-purchase-order.module';

@NgModule({
  declarations: [PurchaseOrderComponent],
  imports: [
    CommonModule,
    ContentHeaderModule,
    PurchaseOrderRoutingModule,
    UpsertPurchaseOrderModule,
    ViewPurchaseOrderModule,
    PurchaseOrdersListModule,
  ],
  exports: [PurchaseOrderComponent],
})
export class PurchaseOrderModule {}

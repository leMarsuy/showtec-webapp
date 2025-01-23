import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { AddNewCustomerModule } from './add-new-customer/add-new-customer.module';
import { PurchaseOrdersListModule } from './pages/purchase-orders-list/purchase-orders-list.module';
import { UpsertPurchaseOrderModule } from './pages/upsert-purchase-order/upsert-purchase-order.module';
import { ViewPurchaseOrderModule } from './pages/view-purchase-order/view-purchase-order.module';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderService } from './purchase-order.service';

@NgModule({
  declarations: [PurchaseOrderComponent],
  imports: [
    CommonModule,
    ContentHeaderModule,
    PurchaseOrderRoutingModule,
    UpsertPurchaseOrderModule,
    ViewPurchaseOrderModule,
    PurchaseOrdersListModule,
    AddNewCustomerModule,
  ],
  exports: [PurchaseOrderComponent],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}

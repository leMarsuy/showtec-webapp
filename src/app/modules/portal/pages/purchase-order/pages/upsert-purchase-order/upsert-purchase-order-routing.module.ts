import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpsertPurchaseOrderComponent } from './upsert-purchase-order.component';

const routes: Routes = [{ path: '', component: UpsertPurchaseOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpsertPurchaseOrderRoutingModule {}

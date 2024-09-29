import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPurchaseOrderComponent } from './view-purchase-order.component';

const routes: Routes = [{ path: '', component: ViewPurchaseOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPurchaseOrderRoutingModule {}

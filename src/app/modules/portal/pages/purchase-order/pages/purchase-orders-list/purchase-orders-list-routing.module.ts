import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrdersListComponent } from './purchase-orders-list.component';

const routes: Routes = [{ path: '', component: PurchaseOrdersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrdersListRoutingModule {}

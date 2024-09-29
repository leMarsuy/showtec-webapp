import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { purchaseOrderResolver } from './purchase-order.resolver';

const routes: Routes = [
  {
    path: '',
    component: PurchaseOrderComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import(
            './pages/purchase-orders-list/purchase-orders-list.module'
          ).then((m) => m.PurchaseOrdersListModule),
      },
      {
        path: 'create',
        loadChildren: () =>
          import(
            './pages/upsert-purchase-order/upsert-purchase-order.module'
          ).then((m) => m.UpsertPurchaseOrderModule),
      },
      {
        path: 'edit/:id',
        resolve: { purchaseOrder: purchaseOrderResolver },
        loadChildren: () =>
          import(
            './pages/upsert-purchase-order/upsert-purchase-order.module'
          ).then((m) => m.UpsertPurchaseOrderModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrderRoutingModule {}

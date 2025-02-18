import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehousingComponent } from './warehousing.component';

const routes: Routes = [
  {
    path: '',
    component: WarehousingComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './pages/warehouse-preview-list/warehouse-preview-list.module'
          ).then((m) => m.WarehousePreviewListModule),
      },
      {
        path: 'transfer-stocks',
        loadChildren: () =>
          import(
            './pages/warehouse-stock-transfer/warehouse-stock-transfer.module'
          ).then((m) => m.WarehouseStockTransferModule),
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehousingRoutingModule {}

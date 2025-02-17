import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseStockTransferComponent } from './warehouse-stock-transfer.component';

const routes: Routes = [
  { path: '', component: WarehouseStockTransferComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseStockTransferRoutingModule {}

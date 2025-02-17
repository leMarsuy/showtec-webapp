import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseStockTransferRoutingModule } from './warehouse-stock-transfer-routing.module';
import { WarehouseStockTransferComponent } from './warehouse-stock-transfer.component';


@NgModule({
  declarations: [
    WarehouseStockTransferComponent
  ],
  imports: [
    CommonModule,
    WarehouseStockTransferRoutingModule
  ]
})
export class WarehouseStockTransferModule { }

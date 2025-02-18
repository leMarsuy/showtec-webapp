import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { WarehouseStockTransferRoutingModule } from './warehouse-stock-transfer-routing.module';
import { WarehouseStockTransferComponent } from './warehouse-stock-transfer.component';

@NgModule({
  declarations: [WarehouseStockTransferComponent],
  imports: [CommonModule, WarehouseStockTransferRoutingModule, MatIconModule],
})
export class WarehouseStockTransferModule {}

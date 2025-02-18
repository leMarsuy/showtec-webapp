import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WarehouseStockTransferRoutingModule } from './warehouse-stock-transfer-routing.module';
import { WarehouseStockTransferComponent } from './warehouse-stock-transfer.component';

@NgModule({
  declarations: [WarehouseStockTransferComponent],
  imports: [
    CommonModule,
    WarehouseStockTransferRoutingModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    DragDropModule,
  ],
})
export class WarehouseStockTransferModule {}

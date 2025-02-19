import { DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
    MatCheckboxModule,
    MatSlideToggleModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class WarehouseStockTransferModule {}

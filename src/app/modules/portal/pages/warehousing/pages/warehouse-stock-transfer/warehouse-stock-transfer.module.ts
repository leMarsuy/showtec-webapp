import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectTransferQuantityComponent } from './components/select-transfer-quantity/select-transfer-quantity.component';
import { StockDropListComponent } from './components/stock-drop-list/stock-drop-list.component';
import { WarehouseStockTransferRoutingModule } from './warehouse-stock-transfer-routing.module';
import { WarehouseStockTransferComponent } from './warehouse-stock-transfer.component';
import { WarehouseStockTransferService } from './warehouse-stock-transfer.service';

@NgModule({
  declarations: [
    WarehouseStockTransferComponent,
    StockDropListComponent,
    SelectTransferQuantityComponent,
  ],
  imports: [
    CommonModule,
    WarehouseStockTransferRoutingModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    ScrollingModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [WarehouseStockTransferService],
})
export class WarehouseStockTransferModule {}

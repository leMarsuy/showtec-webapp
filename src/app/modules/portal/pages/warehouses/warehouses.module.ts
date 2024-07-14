import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WarehousesComponent } from './warehouses.component';
import { AddWarehouseComponent } from './add-warehouse/add-warehouse.component';
import { EditWarehouseComponent } from './edit-warehouse/edit-warehouse.component';
import { TableModule } from '@shared/components/table/table.module';
import { ContentHeaderModule } from '@shared/components/content-header/content-header.module';

@NgModule({
  declarations: [
    WarehousesComponent,
    AddWarehouseComponent,
    EditWarehouseComponent,
  ],
  imports: [
    CommonModule,
    WarehousesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    //
    ContentHeaderModule,
    TableModule,
  ],
})
export class WarehousesModule {}

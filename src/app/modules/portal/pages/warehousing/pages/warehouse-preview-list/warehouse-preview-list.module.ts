import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousePreviewListRoutingModule } from './warehouse-preview-list-routing.module';
import { WarehousePreviewListComponent } from './warehouse-preview-list.component';


@NgModule({
  declarations: [
    WarehousePreviewListComponent
  ],
  imports: [
    CommonModule,
    WarehousePreviewListRoutingModule
  ]
})
export class WarehousePreviewListModule { }

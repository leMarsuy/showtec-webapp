import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehousePreviewListComponent } from './warehouse-preview-list.component';

const routes: Routes = [{ path: '', component: WarehousePreviewListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehousePreviewListRoutingModule {}

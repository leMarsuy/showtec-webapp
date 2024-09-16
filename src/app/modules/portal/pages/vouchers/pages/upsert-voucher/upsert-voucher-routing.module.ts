import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpsertVoucherComponent } from './upsert-voucher.component';

const routes: Routes = [{ path: '', component: UpsertVoucherComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpsertVoucherRoutingModule {}

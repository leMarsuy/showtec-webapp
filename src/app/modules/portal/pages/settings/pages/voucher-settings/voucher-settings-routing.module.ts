import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoucherSettingsComponent } from './voucher-settings.component';

const routes: Routes = [{ path: '', component: VoucherSettingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoucherSettingsRoutingModule {}

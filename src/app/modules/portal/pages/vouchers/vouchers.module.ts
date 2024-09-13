import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { RouterModule } from '@angular/router';
import { VouchersComponent } from './vouchers.component';
import { VouchersListModule } from './pages/vouchers-list/vouchers-list.module';
import { UpsertVoucherModule } from './pages/upsert-voucher/upsert-voucher.module';

@NgModule({
  declarations: [VouchersComponent],
  imports: [
    CommonModule,
    VouchersRoutingModule,
    ContentHeaderModule,
    RouterModule,
    VouchersListModule,
    UpsertVoucherModule,
  ],
})
export class VouchersModule {}

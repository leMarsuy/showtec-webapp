import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VouchersComponent } from './vouchers.component';
import { vouchersResolver } from './vouchers.resolver';

const routes: Routes = [
  {
    path: '',
    component: VouchersComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/vouchers-list/vouchers-list.module').then(
            (m) => m.VouchersListModule,
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/upsert-voucher/upsert-voucher.module').then(
            (m) => m.UpsertVoucherModule,
          ),
      },
      {
        path: 'edit/:id',
        resolve: { voucher: vouchersResolver },
        loadChildren: () =>
          import('./pages/upsert-voucher/upsert-voucher.module').then(
            (m) => m.UpsertVoucherModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VouchersRoutingModule {}

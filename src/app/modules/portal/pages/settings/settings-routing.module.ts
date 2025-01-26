import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: {
      baseUrl: 'settings',
    },
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./pages/account-settings/account-settings.module').then(
            (m) => m.AccountSettingsModule,
          ),
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./pages/product-settings/product-settings.module').then(
            (m) => m.ProductSettingsModule,
          ),
      },
      {
        path: 'voucher',
        loadChildren: () =>
          import('./pages/voucher-settings/voucher-settings.module').then(
            (m) => m.VoucherSettingsModule,
          ),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./pages/customers/customers.module').then(
            (m) => m.CustomersModule,
          ),
      },

      {
        path: 'suppliers',
        loadChildren: () =>
          import('./pages/suppliers/suppliers.module').then(
            (m) => m.SuppliersModule,
          ),
      },
      {
        path: 'warehouses',
        loadChildren: () =>
          import('./pages/warehouses/warehouses.module').then(
            (m) => m.WarehousesModule,
          ),
      },
      {
        path: '**',
        redirectTo: 'account',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalComponent } from './portal.component';
import { portalGuard } from './portal.guard';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    canActivate: [portalGuard],
    children: [
      // {
      //   path: 'dashboard',
      //   loadChildren: () =>
      //     import('./pages/dashboard/dashboard.module').then(
      //       (m) => m.DashboardModule
      //     ),
      // },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./pages/customers/customers.module').then(
            (m) => m.CustomersModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./pages/suppliers/suppliers.module').then(
            (m) => m.SuppliersModule
          ),
      },
      {
        path: 'warehouses',
        loadChildren: () =>
          import('./pages/warehouses/warehouses.module').then(
            (m) => m.WarehousesModule
          ),
      },
      {
        path: 'out-delivery',
        loadChildren: () =>
          import('./pages/out-delivery/out-delivery.module').then(
            (m) => m.OutDeliveryModule
          ),
      },
      {
        path: 'soa',
        loadChildren: () =>
          import('./pages/soa/soa.module').then((m) => m.SoaModule),
      },
      // {
      //   path: 'expenses',
      //   loadChildren: () =>
      //     import('./pages/expenses/expenses.module').then(
      //       (m) => m.ExpensesModule
      //     ),
      // },
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'vouchers',
        loadChildren: () =>
          import('./pages/vouchers/vouchers.module').then(
            (m) => m.VouchersModule
          ),
      },
      {
        path: 'purchase-order',
        loadChildren: () =>
          import('./pages/purchase-order/purchase-order.module').then(
            (m) => m.PurchaseOrderModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: '',
        redirectTo: 'reports',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {}

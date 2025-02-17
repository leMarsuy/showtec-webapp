import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalComponent } from './portal.component';
import { portalGuard, roleGuard } from './portal.guard';
import { portalResolver } from './portal.resolver';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    canActivate: [portalGuard],
    canActivateChild: [roleGuard],
    resolve: {
      config: portalResolver,
    },
    children: [
      // {
      //   path: 'dashboard',
      //   loadChildren: () =>
      //     import('./pages/dashboard/dashboard.module').then(
      //       (m) => m.DashboardModule
      //     ),
      // },
      {
        path: 'test-warehouse',
        loadChildren: () =>
          import(
            './pages/warehouse-stock-transfer/warehouse-stock-transfer.module'
          ).then((m) => m.WarehouseStockTransferModule),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/products/products.module').then(
            (m) => m.ProductsModule,
          ),
      },
      {
        path: 'purchase-orders',
        loadChildren: () =>
          import('./pages/purchase-order/purchase-order.module').then(
            (m) => m.PurchaseOrderModule,
          ),
      },
      {
        path: 'soa',
        loadChildren: () =>
          import('./pages/soa/soa.module').then((m) => m.SoaModule),
      },
      {
        path: 'out-deliveries',
        loadChildren: () =>
          import('./pages/out-delivery/out-delivery.module').then(
            (m) => m.OutDeliveryModule,
          ),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./pages/transactions/transactions.module').then(
            (m) => m.TransactionsModule,
          ),
      },
      {
        path: 'vouchers',
        loadChildren: () =>
          import('./pages/vouchers/vouchers.module').then(
            (m) => m.VouchersModule,
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
      },

      {
        path: 'roles',
        loadChildren: () =>
          import('./pages/roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.module').then(
            (m) => m.SettingsModule,
          ),
      },
      // {
      //   path: 'expenses',
      //   loadChildren: () =>
      //     import('./pages/expenses/expenses.module').then(
      //       (m) => m.ExpensesModule
      //     ),
      // },
      {
        path: '',
        redirectTo: 'products',
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

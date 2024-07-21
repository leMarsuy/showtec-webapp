import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalComponent } from './portal.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
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
      {
        path: '',
        redirectTo: 'dashboard',
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

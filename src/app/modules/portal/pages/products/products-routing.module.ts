import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductDetailsModule } from './pages/product-details/product-details.module';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/products-list/products-list.module').then(
            (m) => m.ProductsListModule
          ),
      },
      {
        path: ':_id',
        loadChildren: () =>
          import('./pages/product-details/product-details.module').then(
            (m) => ProductDetailsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}

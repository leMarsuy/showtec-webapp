import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { stockCheckerAuthResolver } from './stock-checker-auth.resolver';
import { StockCheckerComponent } from './stock-checker.component';

const routes: Routes = [
  {
    path: '',
    component: StockCheckerComponent,
    resolve: { isUser: stockCheckerAuthResolver },
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      /**
       * @description For Future Reference/ if needed
       */

      // {
      //   path: 'home',
      //   loadChildren: () =>
      //     import('./pages/product-list/product-list.module').then(
      //       (m) => m.ProductListModule
      //     ),
      // },
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/product-list/product-list.module').then(
            (m) => m.ProductListModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockCheckerRoutingModule {}

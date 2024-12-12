import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';
import { ListFilterModule } from './components/list-filter/list-filter.module';
import { ListTableModule } from './components/list-table/list-table.module';

@NgModule({
  declarations: [ProductListComponent],
  exports: [ProductListComponent],
  imports: [
    CommonModule,
    ProductListRoutingModule,
    ListFilterModule,
    ListTableModule,
    AsyncPipe,
  ],
})
export class ProductListModule {}

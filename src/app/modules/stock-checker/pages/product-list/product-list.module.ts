import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ListFilterModule } from './components/list-filter/list-filter.module';
import { ListTableModule } from './components/list-table/list-table.module';
import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';

@NgModule({
  declarations: [ProductListComponent],
  exports: [ProductListComponent],
  imports: [
    CommonModule,
    ProductListRoutingModule,
    ListFilterModule,
    ListTableModule,
  ],
})
export class ProductListModule {}

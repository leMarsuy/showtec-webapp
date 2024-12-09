import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';
import { ListFilterModule } from './components/list-filter/list-filter.module';

@NgModule({
  declarations: [ProductListComponent],
  exports: [ProductListComponent],
  imports: [CommonModule, ProductListRoutingModule, ListFilterModule],
})
export class ProductListModule {}

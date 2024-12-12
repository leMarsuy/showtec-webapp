import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ProductListFilters {
  sort?: string;
  classifications?: string;
  searchText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private sort: string = 'sku';
  private classifications: string = '';
  private searchText: string = '';

  productListFilters$ = new Subject<ProductListFilters>();

  setProductlistFilters(filters: ProductListFilters) {
    this.classifications = filters.classifications ?? this.classifications;
    this.sort = filters.sort ?? this.sort;
    this.searchText = filters.searchText ?? this.searchText;

    const query = {
      classifications: this.classifications,
      sort: this.sort,
      searchText: this.searchText,
    };

    this.productListFilters$.next(query);
  }
}

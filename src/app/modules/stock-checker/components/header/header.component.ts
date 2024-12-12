import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductListService } from '../../pages/product-list/product-list.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly logoSrc = 'images/logo.png';
  placeholder = 'Search...';
  searchText = new FormControl('');

  private readonly productListService = inject(ProductListService);

  requestFetchProducts() {
    const searchText = this.searchText.value ?? '';
    this.productListService.setProductlistFilters({ searchText });
  }
}

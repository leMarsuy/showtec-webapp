import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { ProductListService } from '../../pages/product-list/product-list.service';
import { StockCheckerService } from '../../stock-checker.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  readonly logoSrc = 'images/logo.png';
  readonly placeholder = 'Search...';

  searchText = new FormControl('');
  isUser!: boolean;

  private readonly productListService = inject(ProductListService);
  private readonly stockCheckerService = inject(StockCheckerService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.isUser = this.stockCheckerService.isUserSession();
  }

  navigateToPortal() {
    if (!this.isUser) return;

    this.router.navigate([PORTAL_PATHS.baseUrl]);
  }

  requestFetchProducts() {
    const searchText = this.searchText.value ?? '';
    this.productListService.setProductlistFilters({ searchText });
  }
}

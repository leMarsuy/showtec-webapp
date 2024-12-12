import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { Product } from '@app/core/models/product.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { StockCheckerApiService } from '@app/shared/services/api/stock-checker-api/stock-checker-api.service';
import {
  BehaviorSubject,
  finalize,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { ProductListFilters, ProductListService } from './product-list.service';
import { QueryParams } from '@app/core/interfaces/query-params.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly stockCheckerApi = inject(StockCheckerApiService);
  private readonly productListService = inject(ProductListService);
  private readonly snackbar = inject(SnackbarService);

  products$ = new Observable<Product[]>();
  loading$ = new BehaviorSubject<boolean>(false);

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  query!: QueryParams & { classifications?: string };

  private readonly destroyed$ = new Subject<void>();

  constructor() {
    this.setQuery();
    this.getProducts();
  }

  ngOnInit(): void {
    this.productListService.productListFilters$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((productFilter) => {
        this.setQuery(productFilter);
        this.getProducts();
      });
  }

  getProducts() {
    this.loading$.next(true);
    this.stockCheckerApi
      .getProducts(this.query)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (response) => {
          const resp = response as HttpGetResponse;
          const products = resp.records as Product[];
          this.products$ = of(products);
          this.page.length = resp.total;
        },
        error: ({ error }: HttpErrorResponse) => {
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getProducts();
  }

  private setQuery(filters?: ProductListFilters) {
    const query = {
      pageSize: this.page.pageSize,
      pageIndex: this.page.pageIndex,
      sort: filters?.sort ?? '',
      classifications: filters?.classifications ?? '',
      searchText: filters?.searchText ?? '',
    };

    this.query = query;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HttpGetResponse } from '@core/interfaces/http-get-response.interface';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { Product } from '@core/models/product.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnType } from '@core/enums/column-type.enum';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  searchForm = new FormGroup({
    searchField: new FormControl(''),
    searchText: new FormControl(''),
  });
  searchFields = [
    { label: 'All', value: '' },
    { label: 'SKU', value: 'sku' },
    { label: 'Brand', value: 'brand' },
    { label: 'Model', value: 'model' },
  ];
  page: PageEvent = {
    pageIndex: 0,
    pageSize: 50,
    length: -1,
  };
  sort = '';
  columns: TableColumn[] = [
    {
      label: 'SKU',
      dotNotationPath: 'sku',
      type: ColumnType.STRING,
    },
    {
      label: 'Brand',
      dotNotationPath: 'brand',
      type: ColumnType.STRING,
    },
    {
      label: 'Model',
      dotNotationPath: 'model',
      type: ColumnType.STRING,
    },
    {
      label: 'Classification',
      dotNotationPath: 'classification',
      type: ColumnType.STRING,
    },
    {
      label: 'Quantity',
      dotNotationPath: '_$stockSummary.In Stock',
      type: ColumnType.NUMBER,
    },
  ];
  products!: Product[];

  constructor(
    private dialog: MatDialog,
    private productApi: ProductApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.getProducts();
  }

  getProducts() {
    this.snackbarService.openLoadingSnackbar('GetData', 'Fetching products...');
    this.productApi
      .getProducts({
        searchText: this.searchForm.get('searchText')?.value || '',
        searchField: this.searchForm.get('searchField')?.value || '',
        ...this.page,
      })
      .subscribe({
        next: (resp) => {
          var response = resp as HttpGetResponse;
          this.snackbarService.closeLoadingSnackbar();
          this.products = response.records as Product[];
          this.page.length = response.total;
        },
        error: (err: HttpErrorResponse) => {
          this.snackbarService.openErrorSnackbar(
            'HttpGetError',
            err.error.message
          );
        },
      });
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getProducts();
  }

  rowEvent(product: Product) {
    this.router.navigate([product._id], { relativeTo: this.activatedRoute });
  }
}

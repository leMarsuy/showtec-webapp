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
import { Color } from '@app/core/enums/color.enum';
import { ProductStatus } from '@app/core/enums/product-status.enum';
import { PRODUCT_CLASSIFICATIONS } from '@app/core/lists/product-classifications.list';
import { Alignment } from '@app/core/enums/align.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  searchForm = new FormGroup({
    searchField: new FormControl(''),
    searchText: new FormControl(''),
    classification: new FormControl(''),
  });

  CLASSIFICATIONS = PRODUCT_CLASSIFICATIONS;

  searchFields = [
    { label: 'All', value: '' },
    { label: 'SKU', value: 'sku' },
    { label: 'Brand', value: 'brand' },
    { label: 'Model', value: 'model' },
    { label: 'Description', value: 'description' },
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
      label: 'Description',
      dotNotationPath: 'description',
      type: ColumnType.STRING,
    },
    {
      label: 'Stock',
      dotNotationPath: '_$stockSummary.In Stock',
      type: ColumnType.NUMBER,
      align: Alignment.CENTER,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          color: Color.SUCCESS,
          value: ProductStatus.ACTIVE,
        },
        {
          color: Color.DEAD,
          value: ProductStatus.DISCONTINUED,
        },
        {
          color: Color.ERROR,
          value: ProductStatus.OUT_OF_STOCK,
        },
      ],
    },
  ];
  products!: Product[];

  constructor(
    private productApi: ProductApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private confirmation: ConfirmationService
  ) {
    this.getProducts();
  }

  getProducts() {
    console.log(this.searchForm.getRawValue());
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
            err.error.errorCode,
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

  clearForm() {
    this.searchForm.patchValue({
      searchText: '',
      classification: '',
      searchField: '',
    });

    this.searchForm.markAsUntouched();
    this.getProducts();
  }

  rowEvent(product: Product) {
    this.router.navigate([product._id], { relativeTo: this.activatedRoute });
  }

  download() {
    this.confirmation
      .open(
        'Confirmation',
        'You will be downloading all the products with serial numbers. <span class="text-rose-500">Would you like to proceed?</span>'
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.productApi.getProducts();
        }
      });
  }

  _batchDownload() {}
}

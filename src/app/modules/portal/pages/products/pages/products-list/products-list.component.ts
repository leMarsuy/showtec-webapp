import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ProductStatus } from '@app/core/enums/product-status.enum';
import { StockType } from '@app/core/enums/stock-type.enum';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { PRODUCT_CLASSIFICATIONS } from '@app/core/lists/product-classifications.list';
import { FileService } from '@app/shared/services/file/file.service';
import { generateFileName } from '@app/shared/utils/stringUtil';
import { ColumnType } from '@core/enums/column-type.enum';
import { HttpGetResponse } from '@core/interfaces/http-get-response.interface';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { Product } from '@core/models/product.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  searchText = new FormControl('');

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
      label: 'Sealed',
      dotNotationPath: '_$stockTypeSummary.Sealed',
      type: ColumnType.NUMBER,
      align: Alignment.CENTER,
    },
    {
      label: 'Demo',
      dotNotationPath: '_$stockTypeSummary.Demo',
      type: ColumnType.NUMBER,
      align: Alignment.CENTER,
    },
    {
      label: 'Service',
      dotNotationPath: '_$stockTypeSummary.Service',
      type: ColumnType.NUMBER,
      align: Alignment.CENTER,
    },
    {
      label: 'In Stock',
      dotNotationPath: '_$stockSummary.In Stock',
      type: ColumnType.NUMBER,
    },
    {
      label: 'For Delivery',
      dotNotationPath: '_$stockSummary.For Delivery',
      type: ColumnType.NUMBER,
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
  downloading = false;

  query: QueryParams = {
    pageIndex: 0,
    pageSize: 10,
  };

  constructor(
    private productApi: ProductApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fileApi: FileService,
  ) {
    this.getProducts();
  }

  getProducts(isPageEvent = false) {
    this.setQuery(isPageEvent);
    this.snackbarService.openLoadingSnackbar('GetData', 'Fetching products...');
    this.productApi.getProducts(this.query).subscribe({
      next: (resp) => {
        var response = resp as HttpGetResponse;
        this.snackbarService.closeLoadingSnackbar();
        this.products = this.remapProducts(response.records as Product[]);
        this.page.length = response.total;
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message,
        );
      },
    });
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getProducts(true);
  }

  private setQuery(isPageEvent = false) {
    const pageIndex = isPageEvent ? this.page.pageIndex : 0;
    const searchText = this.searchText.value ?? '';
    const sort = 'brand model';
    this.query = {
      searchText,
      pageIndex,
      pageSize: this.page.pageSize,
      sort,
    };
  }

  rowEvent(product: Product) {
    this.router.navigate([product._id], { relativeTo: this.activatedRoute });
  }

  exportExcelProductSNs() {
    this.snackbarService.openLoadingSnackbar(
      'Please Wait',
      'Downloading Excel file...',
    );
    this.downloading = true;
    const query: QueryParams = {
      searchText: this.query.searchText,
    };

    this.productApi.exportExcelProductSerialNos(query).subscribe({
      next: (response: any) => {
        this.downloading = false;
        this.snackbarService.closeLoadingSnackbar();
        const fileName = generateFileName('PRODUCT_SERIAL_NO', 'xlsx');
        this.fileApi.downloadFile(response.body as Blob, fileName);
      },
      error: ({ error }: HttpErrorResponse) => {
        this.downloading = false;
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
      complete: () => {
        this.downloading = false;
      },
    });
  }

  exportExcelProducts() {
    this.snackbarService.openLoadingSnackbar(
      'Please Wait',
      'Downloading Excel file...',
    );
    this.downloading = true;
    const query: QueryParams = {
      searchText: this.query.searchText,
    };

    this.productApi.exportExcelProducts(query).subscribe({
      next: (response: any) => {
        this.downloading = false;
        this.snackbarService.closeLoadingSnackbar();
        const fileName = generateFileName('PRODUCT_STOCKS', 'xlsx');
        this.fileApi.downloadFile(response.body as Blob, fileName);
      },
      error: ({ error }: HttpErrorResponse) => {
        this.downloading = false;
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
      complete: () => {
        this.downloading = false;
      },
    });
  }
  private remapProducts(products: any) {
    return products.map((product: any) => {
      const _$stockTypeSummary = {
        Sealed: 0,
        Demo: 0,
        Service: 0,
      };

      for (const stock of product.stocks) {
        switch (stock.type) {
          case StockType.SEALED:
            _$stockTypeSummary.Sealed += 1;
            break;
          case StockType.DEMO:
            _$stockTypeSummary.Demo += 1;
            break;
          case StockType.SERVICE:
            _$stockTypeSummary.Service += 1;
            break;
          default:
            break;
        }
      }
      product['_$stockTypeSummary'] = _$stockTypeSummary;
      return product;
    });
  }
}

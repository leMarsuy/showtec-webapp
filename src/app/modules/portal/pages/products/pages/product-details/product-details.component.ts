import { Component, OnInit } from '@angular/core';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Product } from '@core/models/product.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UpdateStockComponent } from './update-stock/update-stock.component';
import { Stock } from '@core/models/stock.model';
import { ColumnType } from '@core/enums/column-type.enum';
import { Color } from '@app/core/enums/color.enum';
import { STOCK_STATUSES, StockStatus } from '@app/core/enums/stock-status.enum';
import { UpdateFieldComponent } from './update-field/update-field.component';
import { PRODUCT_CLASSIFICATIONS } from '@app/core/lists/product-classifications.list';

import { FormField } from '@app/core/interfaces/form-field.interface';
import { StockType } from '@app/core/enums/stock-type.enum';
import { EditStockComponent } from './edit-stock/edit-stock.component';
import { EditProductComponent } from '../../edit-product/edit-product.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  STOCK_STATUSES = ['All', ...STOCK_STATUSES];
  selectedStockStatus = '';

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };
  filteredStocks: Stock[] = [];
  total = 0;
  _id!: string;
  product!: Product;
  constructor(
    private productApi: ProductApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {
    activatedRoute.params.pipe(map((p) => p['_id'])).subscribe((_id) => {
      this._id = _id;
      this.getProductById();
    });
  }

  columns: TableColumn[] = [
    {
      label: 'S/N',
      dotNotationPath: 'serialNumber',
      type: ColumnType.STRING,
    },
    {
      label: 'Stock Age',
      dotNotationPath: 'scanDate',
      type: ColumnType.AGE_IN_DAYS,
    },
    {
      label: 'Unit Type',
      dotNotationPath: 'type',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          color: Color.SUCCESS,
          value: StockType.SEALED,
        },
        {
          color: Color.INFO,
          value: StockType.DEMO,
        },
        {
          color: Color.WARNING,
          value: StockType.SERVICE,
        },
      ],
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          color: Color.SUCCESS,
          value: StockStatus.IN_STOCK,
        },
        {
          color: Color.INFO,
          value: StockStatus.FOR_DELIVERY,
        },
        {
          color: Color.ERROR,
          value: StockStatus.RETURNED,
        },
      ],
    },
  ];

  ngOnInit(): void {}

  getProductById() {
    this.productApi.getProductById(this._id).subscribe({
      next: (res) => {
        console.log(res);
        this.product = res as Product;
        this.product.stocks =
          this.product.stocks.sort((a, b) => {
            if (a.serialNumber > b.serialNumber) return 1;
            return -1;
          }) || [];
        this.page.length = this.product.stocks.length;
        this.filterStocks('All');
      },
      error: (err) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
        setTimeout(() => {
          this.router.navigate(['/portal/products']);
        }, 3000);
      },
    });
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    var skip = this.page.pageSize * this.page.pageIndex;
    this.filteredStocks = [
      ...this.product.stocks.slice(skip, skip + this.page.pageSize),
    ];

    console.log(skip, e);
  }

  filterStocks(status: string) {
    this.selectedStockStatus = status;
    if (this.selectedStockStatus != 'All')
      this.filteredStocks = [
        ...this.product.stocks.filter(
          (o) => o.status === this.selectedStockStatus
        ),
      ];
    else this.filteredStocks = [...this.product.stocks];
  }

  openNewStock() {
    this.dialog
      .open(UpdateStockComponent, {
        width: '80rem',
        maxWidth: '80rem',
        disableClose: true,
        data: {
          _id: this.product._id,
          name: this.product.brand + ' ' + this.product.model,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getProductById();
      });
  }

  fields: FormField[] = [
    {
      label: 'SKU',
      path: 'sku',
    },
    {
      label: 'Brand',
      path: 'brand',
    },
    {
      label: 'Model',
      path: 'model',
    },
    {
      label: 'Classification',
      path: 'classification',
      select: { options: [...PRODUCT_CLASSIFICATIONS] },
    },
    {
      label: 'Price',
      path: 'price.amount',
    },
  ];

  onClickEditField(field: FormField, value: any) {
    this.dialog
      .open(UpdateFieldComponent, {
        width: '50rem',
        maxWidth: '50rem',
        disableClose: true,
        data: {
          field,
          value,
          product: this.product,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res)
          this.snackbarService.openSuccessSnackbar(
            'DataModify',
            `${this.product.brand} ${this.product.model}`
          );
      });
  }

  editStock(stock: Stock) {
    this.dialog
      .open(EditStockComponent, {
        width: '50rem',
        maxWidth: '50rem',
        disableClose: true,
        data: {
          stock,
          _id: this.product._id,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getProductById();
      });
  }

  editProduct() {
    this.dialog
      .open(EditProductComponent, {
        width: '50rem',
        maxWidth: '50rem',
        disableClose: true,
        data: {
          _id: this.product._id,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getProductById();
      });
  }
}

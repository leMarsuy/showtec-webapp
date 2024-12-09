import { Component, OnInit } from '@angular/core';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, of, startWith, switchMap } from 'rxjs';
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
import { STOCK_TYPES, StockType } from '@app/core/enums/stock-type.enum';
import { EditStockComponent } from './edit-stock/edit-stock.component';
import { EditProductComponent } from '../../edit-product/edit-product.component';
import { Alignment } from '@app/core/enums/align.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { HttpErrorResponse } from '@angular/common/http';

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
    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'Edit Stock',
          icon: 'edit',
          action: 'edit',
          color: Color.WARNING,
        },
        {
          name: 'Verify Stock Status',
          icon: 'troubleshoot',
          action: 'check_dr',
          color: Color.DEAD,
        },
      ],
    },
  ];

  constructor(
    private productApi: ProductApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private confirmation: ConfirmationService
  ) {
    activatedRoute.params.pipe(map((p) => p['_id'])).subscribe((_id) => {
      this._id = _id;
      this.getProductById();
    });
  }

  ngOnInit(): void {}

  getProductById() {
    this.productApi.getProductById(this._id).subscribe({
      next: (res) => {
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
  }

  actionEvent(e: any) {
    const { action } = e.action;
    const stock = e.element;

    switch (action) {
      case 'edit':
        this.editStock(stock);
        break;
      case 'check_dr':
        this.verifyStockStatus(stock);
        break;
    }
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

  private editStock(stock: Stock) {
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

  private verifyStockStatus(stock: Stock) {
    const stockStatus = stock.status;
    const stockId = stock._id;

    let updateStatus: null | StockStatus = null;
    this.productApi
      .checkStockInOutDelivery(stockId)
      .pipe(
        switchMap((hasOutdelivery) => {
          const outdelivery = hasOutdelivery as OutDelivery;
          let message = '';
          if (hasOutdelivery && stockStatus === StockStatus.IN_STOCK) {
            //Change IN STOCK to FOR DELIVERY
            message = `This stock is "<b class="text-sky-400">${stockStatus}</b>" but used in pending delivery (<p class="inline text-sky-600">DR# ${outdelivery?.code?.value}</p>).<br>Update the status to "<b class="text-sky-400">${StockStatus.FOR_DELIVERY}</b>"?`;
            updateStatus = StockStatus.FOR_DELIVERY;
            return this.confirmation
              .open('Update Confirmation', message)
              .afterClosed()
              .pipe(filter((result) => result));
          }
          if (
            hasOutdelivery === false &&
            stockStatus === StockStatus.FOR_DELIVERY
          ) {
            //Change FOR DELIVERY to IN STOCK
            message = `This stock is "<b class="text-sky-400">${stockStatus}</b>" but has not used in delivery.<br>Update the status to "<b class="text-sky-400">${StockStatus.IN_STOCK}</b>"?`;
            updateStatus = StockStatus.IN_STOCK;
            return this.confirmation
              .open('Update Confirmation', message)
              .afterClosed()
              .pipe(filter((result) => result));
          }
          return of(false);
        }),
        switchMap((hasAccept) => {
          if (!hasAccept || !updateStatus)
            return of(
              this.snackbarService.openSuccessSnackbar(
                'No Necessary Update Required'
              )
            );

          const updateStock = {
            _id: stockId,
            status: updateStatus,
            serialNumber: stock.serialNumber,
            type: stock.type,
          };
          return this.productApi
            .updateStockById(this.product._id, updateStock)
            .pipe(map(() => true));
        })
      )
      .subscribe({
        next: (response) => {
          if (response === true) {
            this.snackbarService.openSuccessSnackbar(
              'Stock Status Update Success'
            );
            this.getProductById();
          }
        },
        error: ({ error }: HttpErrorResponse) => {
          console.error(error);
          this.snackbarService.openErrorSnackbar(
            error.errorCode,
            error.message
          );
        },
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

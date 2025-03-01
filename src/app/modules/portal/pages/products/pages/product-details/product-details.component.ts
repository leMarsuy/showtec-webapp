import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Color } from '@app/core/enums/color.enum';
import { STOCK_STATUSES, StockStatus } from '@app/core/enums/stock-status.enum';
import { PRODUCT_CLASSIFICATIONS } from '@app/core/lists/product-classifications.list';
import { ColumnType } from '@core/enums/column-type.enum';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { Product } from '@core/models/product.model';
import { Stock } from '@core/models/stock.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { filter, map, of, switchMap } from 'rxjs';
import { UpdateFieldComponent } from './update-field/update-field.component';
import { UpdateStockComponent } from './update-stock/update-stock.component';

import { HttpErrorResponse } from '@angular/common/http';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { Alignment } from '@app/core/enums/align.enum';
import { StockType } from '@app/core/enums/stock-type.enum';
import { FormField } from '@app/core/interfaces/form-field.interface';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { EditProductComponent } from '../../edit-product/edit-product.component';
import { EditStockComponent } from './edit-stock/edit-stock.component';
import { OutdeliverySummaryComponent } from './outdelivery-summary/outdelivery-summary.component';

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
          color: Color.INFO,
          value: StockStatus.RELEASED,
        },
        {
          color: Color.WARNING,
          value: StockStatus.SOLD,
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
    private confirmation: ConfirmationService,
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
          err.error.message,
        );
        setTimeout(() => {
          this.router.navigate([PORTAL_PATHS.products.relativeUrl]);
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
          (o) => o.status === this.selectedStockStatus,
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
            `${this.product.brand} ${this.product.model}`,
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

    const openConfirmation = (message: string) => {
      return this.confirmation
        .open('Stock Status Update', message)
        .afterClosed()
        .pipe(filter((result) => result));
    };

    let updateStatus: null | StockStatus = null;

    this.productApi
      .checkStockInOutDelivery(stockId)
      .pipe(
        switchMap((hasOutdelivery) => {
          const outdelivery = hasOutdelivery as OutDelivery;
          let message = '';
          if (hasOutdelivery && stockStatus === StockStatus.IN_STOCK) {
            //Change IN STOCK to FOR DELIVERY
            message = `This stock is marked as "<b class="text-sky-500">${stockStatus}</b>" but is allocated for a pending delivery (<span class="text-sky-600">DR# ${outdelivery?.code?.value}</span>).<br>Should the status be updated to "<b class="text-sky-500">${StockStatus.FOR_DELIVERY}</b>"?`;
            updateStatus = StockStatus.FOR_DELIVERY;
            return openConfirmation(message);
          }

          if (
            hasOutdelivery === false &&
            stockStatus === StockStatus.FOR_DELIVERY
          ) {
            //Change FOR DELIVERY to IN STOCK
            message = `This stock is marked as "<b class="text-sky-500">${stockStatus}</b>" but hasn't been used for delivery.<br>Should the status be updated to "<b class="text-sky-500">${StockStatus.IN_STOCK}</b>"?`;
            updateStatus = StockStatus.IN_STOCK;
            return openConfirmation(message);
          }

          if (hasOutdelivery && stockStatus === StockStatus.FOR_DELIVERY) {
            this.dialog.open(OutdeliverySummaryComponent, {
              data: {
                outdelivery,
                stock,
              },
              minWidth: '55vw',
            });
            return of(true);
          }

          return of(false);
        }),
        switchMap((hasAccept) => {
          if (!hasAccept && !updateStatus) {
            return of(
              this.snackbarService.openSuccessSnackbar(
                'Status verified',
                'No changes required.',
              ),
            );
          }

          if (hasAccept && !updateStatus) {
            //if stock is verified to be For Delivery and has active/pending Out Delivery
            return of(null);
          }

          this.snackbarService.openLoadingSnackbar(
            'Updating stock',
            'Please wait...',
          );
          const updateStock: any = {
            _id: stockId,
            status: updateStatus,
            serialNumber: stock.serialNumber,
            type: stock.type,
          };
          return this.productApi
            .updateStockById(this.product._id, updateStock)
            .pipe(map(() => true));
        }),
      )
      .subscribe({
        next: (response) => {
          if (response === true) {
            this.snackbarService.closeLoadingSnackbar();
            setTimeout(() => {
              this.snackbarService.openSuccessSnackbar(
                'Update Success!',
                'Stock status has been updated.',
              );
              this.getProductById();
            }, 800);
          }
        },
        error: ({ error }: HttpErrorResponse) => {
          this.snackbarService.closeLoadingSnackbar();
          console.error(error);
          this.snackbarService.openErrorSnackbar(
            error.errorCode,
            error.message,
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

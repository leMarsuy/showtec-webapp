import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import {
  PURCHASE_ORDER_STATUSES,
  PurchaseOrderStatus,
} from '@app/core/enums/purchase-order.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';
import { ViewPurchaseOrderComponent } from '../view-purchase-order/view-purchase-order.component';

@Component({
  selector: 'app-purchase-orders-list',
  templateUrl: './purchase-orders-list.component.html',
  styleUrl: './purchase-orders-list.component.scss',
})
export class PurchaseOrdersListComponent {
  placeholder = 'Search for Voucher No.';
  searchText: FormControl = new FormControl('');

  tableFilterStatuses = ['All', ...PURCHASE_ORDER_STATUSES];
  tableFilterStatus = 'All';

  purchaseOrders!: PurchaseOrder[];
  columns: TableColumn[] = [
    {
      label: 'PO No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Customer',
      dotNotationPath: '_customerId.name',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          value: PurchaseOrderStatus.PENDING,
          color: Color.DEAD,
        },
        {
          value: PurchaseOrderStatus.PAID,
          color: Color.SUCCESS,
        },
        {
          value: PurchaseOrderStatus.PARTIAL,
          color: Color.WARNING,
        },
        {
          value: PurchaseOrderStatus.CANCELLED,
          color: Color.ERROR,
        },
      ],
    },
    {
      label: 'Total',
      dotNotationPath: 'summary.grandtotal',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Paid',
      dotNotationPath: 'payment.paid',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Date of PO',
      dotNotationPath: 'purchaseOrderDate',
      type: ColumnType.DATE,
    },

    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'Print PO',
          icon: 'print',
          action: 'print',
          color: Color.DEAD,
        },
        {
          name: 'Edit PO',
          action: 'edit',
          icon: 'edit',
          color: Color.WARNING,
        },
        {
          name: 'View Payment',
          action: 'payments',
          icon: 'money',
          color: Color.SUCCESS,
        },
      ],
    },
  ];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  constructor(
    private purchaseOrderApi: PurchaseOrderApiService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.getPurchaseOrders();
  }

  onFilterStatusChange(status: PurchaseOrderStatus | string) {
    this.tableFilterStatus = status;
    this.getPurchaseOrders();
  }

  getPurchaseOrders() {
    const status =
      this.tableFilterStatus === 'All' ? '' : this.tableFilterStatus;

    this.snackbarService.openLoadingSnackbar('Please Wait', 'Fetching POs...');
    this.purchaseOrderApi
      .getPurchaseOrders(
        {
          searchText: this.searchText.value || '',
          ...this.page,
        },
        status
      )
      .subscribe({
        next: (resp) => {
          const response = resp as HttpGetResponse;
          this.snackbarService.closeLoadingSnackbar();
          this.purchaseOrders = response.records as PurchaseOrder[];
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

  actionEvent(e: any) {
    const { action } = e.action;

    switch (action) {
      case 'edit':
        this.router.navigate(['portal/purchase-order/edit/' + e.element._id]);
        break;
      case 'print':
        this._print(e.element);
        break;
      case 'payments':
        this._viewPayments(e.element._id);
        break;
    }
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getPurchaseOrders();
  }

  private _print(purchaseOrder: PurchaseOrder) {
    if (!purchaseOrder._id) return;
    this.dialog.open(PdfViewerComponent, {
      data: {
        apiCall: this.purchaseOrderApi.getPurchaseOrderPdfReceipt(
          purchaseOrder._id
        ),
        title: 'View PO Receipt',
      },
      maxWidth: '70rem',
      width: '100%',
      disableClose: true,
      autoFocus: false,
    });
  }

  private _viewPayments(id: string) {
    this.dialog
      .open(ViewPurchaseOrderComponent, {
        data: id,
        width: '100rem',
        maxWidth: '100rem',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.getPurchaseOrders();
        }
      });
  }
}

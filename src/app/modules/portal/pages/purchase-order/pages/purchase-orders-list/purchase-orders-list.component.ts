import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { DateFilterType } from '@app/core/enums/date-filter.enum';
import {
  PURCHASE_ORDER_STATUSES,
  PurchaseOrderStatus,
} from '@app/core/enums/purchase-order.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';

@Component({
  selector: 'app-purchase-orders-list',
  templateUrl: './purchase-orders-list.component.html',
  styleUrl: './purchase-orders-list.component.scss',
})
export class PurchaseOrdersListComponent {
  placeholder = 'Search for Purchase No. | Contact Person';
  searchText: FormControl = new FormControl('');

  statusControl = new FormControl('All');
  tableFilterStatuses = ['All', ...PURCHASE_ORDER_STATUSES];
  selectedFilterStatus = 'All';
  selectedFilterDate = DateFilterType.THIS_YEAR;

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
      label: 'Contact Person',
      dotNotationPath: '_customerId.contactPerson',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          value: PurchaseOrderStatus.ACTIVE,
          color: Color.SUCCESS,
        },
        {
          value: PurchaseOrderStatus.PENDING,
          color: Color.DEAD,
        },
        {
          value: PurchaseOrderStatus.PAID,
          color: Color.SUCCESS,
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
      label: 'Date of PO',
      dotNotationPath: 'purchaseOrderDate',
      type: ColumnType.DATE,
    },
    {
      label: 'Delivery Receipts',
      dotNotationPath: 'createdBy.name',
      type: ColumnType.CUSTOM,
      display: (element) => {
        if (!element.outDeliveries?.length) return 'No Deliveries';

        const str = element.outDeliveries.reduce(
          (acc: string, curr: any, index: number) => {
            if (index === 0) {
              return `${curr.code.value}`;
            } else {
              return `${acc}<br>${curr.code.value}`;
            }
          },
          '',
        );

        return str;
      },
    },
    {
      label: 'SOA',
      dotNotationPath: 'soa.code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Created By',
      dotNotationPath: 'createdBy.name',
      type: ColumnType.STRING,
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
      ],
    },
  ];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  query: QueryParams = {
    pageIndex: 0,
    pageSize: 10,
  };

  constructor(
    private purchaseOrderApi: PurchaseOrderApiService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.getPurchaseOrders();
  }

  onFilterStatusChange(event: MatSelectChange) {
    this.selectedFilterStatus = event.value;
    this.getPurchaseOrders();
  }

  onFilterDateChange(dateFilter: any) {
    this.selectedFilterDate = dateFilter;
    this.getPurchaseOrders();
  }

  getPurchaseOrders(isPageEvent = false) {
    this.setQuery(isPageEvent);
    this.snackbarService.openLoadingSnackbar('Please Wait', 'Fetching POs...');
    this.purchaseOrderApi.getPurchaseOrders(this.query).subscribe({
      next: (resp) => {
        const response = resp as HttpGetResponse;
        this.snackbarService.closeLoadingSnackbar();
        this.purchaseOrders = response.records as PurchaseOrder[];
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

  actionEvent(e: any) {
    const { action } = e.action;
    const purchaseOrder = e.element;

    switch (action) {
      case 'edit':
        this.router.navigate([
          PORTAL_PATHS.purchaseOrders.editUrl,
          purchaseOrder._id,
        ]);
        break;
      case 'print':
        this._print(purchaseOrder);
        break;
    }
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getPurchaseOrders(true);
  }

  private setQuery(isPageEvent = false) {
    const status =
      this.selectedFilterStatus === 'All' ? '' : this.selectedFilterStatus;

    const date =
      this.selectedFilterDate === DateFilterType.ALL_TIME
        ? ''
        : this.selectedFilterDate;

    const pageIndex = isPageEvent ? this.page.pageIndex : 0;
    const searchText = this.searchText.value ?? '';

    this.query = {
      searchText,
      status,
      date,
      pageIndex,
      pageSize: this.page.pageSize,
    };
  }

  private _print(purchaseOrder: PurchaseOrder) {
    if (!purchaseOrder._id) return;
    this.dialog.open(PdfViewerComponent, {
      data: {
        apiCall: this.purchaseOrderApi.getPurchaseOrderPdfReceipt(
          purchaseOrder._id,
        ),
        title: 'View Purchase Order',
      },
      maxWidth: '70rem',
      width: '100%',
      disableClose: true,
      autoFocus: false,
    });
  }
}

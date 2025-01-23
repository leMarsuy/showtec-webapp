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
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';
import {
  PURCHASE_ORDER_STATUSES,
  PurchaseOrderStatus,
} from '@app/core/enums/purchase-order.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';
import { FileService } from '@app/shared/services/file/file.service';
import { UtilService } from '@app/shared/services/util/util.service';
import { generateFileName } from '@app/shared/utils/stringUtil';
import { filter, switchMap } from 'rxjs';
import { AddDeliveryReceiptsComponent } from './components/add-delivery-receipts/add-delivery-receipts.component';

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
  selectedFilterDate = DateFilterType.ALL_TIME;

  isLoading = false;

  purchaseOrders!: PurchaseOrder[];
  columns: TableColumn[] = [
    {
      label: 'PO No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Customer',
      dotNotationPath: '_customerId',
      type: ColumnType.CUSTOM,
      display: (element) =>
        this.utilService.object.displayCustomer(element?._customerId),
    },
    {
      label: 'Ordered From',
      dotNotationPath: 'orderedFrom',
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
      label: 'PO # of Items',
      dotNotationPath: 'items',
      type: ColumnType.CUSTOM,
      display: (element) => {
        const totalQuantity = element.items.reduce((acc: any, curr: any) => {
          return acc + curr.STATIC.quantity;
        }, 0);

        return `${totalQuantity} ${totalQuantity > 1 ? 'items' : 'item'}`;
      },
    },
    {
      label: 'Date of PO',
      dotNotationPath: 'purchaseOrderDate',
      type: ColumnType.DATE,
    },

    {
      label: 'Delivery Receipts',
      dotNotationPath: 'outDeliveries',
      type: ColumnType.CUSTOM,
      display: (element) => {
        if (!element.outDeliveries?.length) return 'No Deliveries';
        const activeStatus = [
          OutDeliveryStatus.ACTIVE,
          OutDeliveryStatus.PENDING,
        ];
        const str = this.sortByCode(element.outDeliveries).reduce(
          (acc: string, curr: any, index: number) => {
            const color = activeStatus.includes(curr.status)
              ? '[#1a1b1f]'
              : 'rose-500';

            const formattedStr = (color: string, text: string) => {
              return `<span class='w-fit text-${color} text-center'>${text}</span>`;
            };
            if (index === 0) {
              return `${formattedStr(color, curr.code.value)}`;
            } else {
              return `${acc}${formattedStr(color, curr.code.value)}`;
            }
          },
          '',
        );

        return `<div class='inline-flex flex-col gap-1 py-2 pr-5 max-h-[5rem] overflow-y-scroll'>${str}</div>`;
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
          showIfCondition: {
            status: PurchaseOrderStatus.ACTIVE,
          },
        },
        {
          name: 'Add Delivery Receipts',
          action: 'add-out-delivery',
          icon: NavIcon.DELIVERY_RECEIPT,
          color: Color.DEAD,
          showIfCondition: {
            status: PurchaseOrderStatus.ACTIVE,
          },
        },
        // {
        //   name: 'Reactivate PO',
        //   action: 'reactivate',
        //   icon: NavIcon.PURCHASE_ORDER,
        //   color: Color.SUCCESS,
        //   showIfCondition: {
        //     status: PurchaseOrderStatus.CANCELLED,
        //   },
        // },
        {
          name: 'Cancel PO',
          action: 'cancel',
          icon: 'block',
          color: Color.ERROR,
          showIfCondition: {
            $and: [
              {
                status: PurchaseOrderStatus.ACTIVE,
              },
              {
                soa: {
                  $empty: true,
                },
              },
              {
                outDeliveries: {
                  $empty: true,
                },
              },
            ],
          },
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

  private readonly sortByCode = (array: any) => {
    return array.sort((a: any, b: any) => {
      if (a.code.year !== b.code.year) {
        return b.code.year - a.code.year;
      }

      if (a.code.month !== b.code.month) {
        return b.code.month - a.code.month;
      }
      return b.code.sequence - a.code.sequence;
    });
  };

  constructor(
    private purchaseOrderApi: PurchaseOrderApiService,
    private snackbarService: SnackbarService,
    private confirmationService: ConfirmationService,
    private utilService: UtilService,
    private fileApi: FileService,
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
      case 'add-out-delivery':
        this._openAddOutDeliveries(purchaseOrder._id);
        break;
      case 'cancel':
        this._changePurchaseOrderStatus(
          purchaseOrder,
          PurchaseOrderStatus.CANCELLED,
          action,
        );
        break;
      case 'reactivate':
        this._changePurchaseOrderStatus(
          purchaseOrder,
          PurchaseOrderStatus.ACTIVE,
          action,
        );
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

  private _openAddOutDeliveries(purchaseOrderId: string) {
    this.dialog
      .open(AddDeliveryReceiptsComponent, {
        data: {
          purchaseOrderId,
        },
        maxWidth: '70rem',
        width: '100%',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) this.getPurchaseOrders();
      });
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

  exportTableExcel() {
    const loadingMsg = 'Downloading Excel File...';
    this._setLoadingState(true, loadingMsg);

    const query: QueryParams = {
      searchText: this.query.searchText,
      status: this.query.status,
      date: this.query.date,
    };

    this.purchaseOrderApi.exportExcelPurchaseOrder(query).subscribe({
      next: (response: any) => {
        this._setLoadingState(false);
        const fileName = generateFileName('PURCHASE_ORDERS', 'xlsx');
        this.fileApi.downloadFile(response.body as Blob, fileName);
      },
      error: ({ error }: HttpErrorResponse) => {
        this._setLoadingState(false);
        console.error(error);
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }

  private _changePurchaseOrderStatus(
    purchaseOrder: PurchaseOrder,
    status: PurchaseOrderStatus,
    action: string,
  ) {
    const titleAction = action;
    this.confirmationService
      .open(
        `${titleAction} Purchase Order`,
        `Do you want to ${action} this PO#${purchaseOrder?.code?.value}`,
      )
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.snackbarService.openLoadingSnackbar(
            'Updating Status',
            'Please wait...',
          );
          return this.purchaseOrderApi.patchPurchaseOrderStatusById(
            purchaseOrder?._id ?? '',
            status,
          );
        }),
      )
      .subscribe({
        next: (hasUpdate) => {
          if (!hasUpdate) return;

          this.snackbarService.closeLoadingSnackbar();
          this.snackbarService.openSuccessSnackbar(
            'Update Successful!',
            'Purchase Order status has been updated.',
          );
          setTimeout(() => {
            this.getPurchaseOrders();
          }, 800);
        },
        error: ({ error }) => {
          this.snackbarService.closeLoadingSnackbar();
          console.error(error);
          this.snackbarService.openErrorSnackbar(
            error.errorCode,
            error.message,
          );
        },
      });
  }

  private _setLoadingState(isLoading: boolean, loadingMsg = '') {
    this.isLoading = isLoading;

    if (isLoading) {
      this.snackbarService.openLoadingSnackbar('Please Wait', loadingMsg);
    } else {
      this.snackbarService.closeLoadingSnackbar();
    }
  }
}

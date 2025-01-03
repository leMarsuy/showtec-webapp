import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { DateFilterType } from '@app/core/enums/date-filter.enum';
import {
  PAYMENT_STATUSES,
  PaymentStatus,
} from '@app/core/enums/payment-status.enum';
import { PurchaseOrderStatus } from '@app/core/enums/purchase-order.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Transaction } from '@app/core/models/transaction.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { TransactionApiService } from '@app/shared/services/api/transaction-api/transaction-api.service';
import { FileService } from '@app/shared/services/file/file.service';
import { generateFileName } from '@app/shared/utils/stringUtil';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent {
  placeholder = 'Search for SOA No.';
  searchText = new FormControl('');

  statusControl = new FormControl('All');
  tableFilterStatuses = ['All', ...PAYMENT_STATUSES];
  selectedFilterStatus = 'All';
  selectedFilterDate = DateFilterType.THIS_YEAR;

  private readonly sortBy = '-code.value';

  isLoading = false;

  transactions!: any; // TRANSACTION interface
  columns: TableColumn[] = [
    {
      label: 'SOA No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },

    {
      label: 'Amount',
      dotNotationPath: 'amount',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Payment Method',
      dotNotationPath: 'paymentMethod',
      type: ColumnType.STRING,
    },
    {
      label: 'Bank',
      dotNotationPath: 'bank',
      type: ColumnType.STRING,
    },
    {
      label: 'Payment Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          value: PaymentStatus.ACTIVE,
          color: Color.INFO,
        },
        {
          value: PaymentStatus.COMPLETED,
          color: Color.SUCCESS,
        },
        {
          value: PaymentStatus.PENDING,
          color: Color.INFO,
        },
        {
          value: PaymentStatus.FAILED,
          color: Color.ERROR,
        },
        {
          value: PaymentStatus.CANCELED,
          color: Color.DEAD,
        },
      ],
    },
    {
      label: 'Payment Date',
      dotNotationPath: 'paymentDate',
      type: ColumnType.DATE,
    },
    {
      label: 'Recorded By',
      dotNotationPath: 'recordedBy.name',
      type: ColumnType.STRING,
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
    private snackbarService: SnackbarService,
    private readonly transactionApi: TransactionApiService,
    private readonly fileApi: FileService
  ) {
    this.getTransactions();
  }

  getTransactions(isPageEvent = false) {
    this.setQuery(isPageEvent);
    const loadingMsg = 'Fetching transactions...';

    this._setLoadingState(true, loadingMsg);

    this.transactionApi
      .getTransactions(this.query)
      .pipe(finalize(() => this._setLoadingState(false)))
      .subscribe({
        next: (resp) => {
          const response = resp as HttpGetResponse;
          this.transactions = response.records as Transaction[];
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

  onFilterStatusChange(event: MatSelectChange) {
    this.selectedFilterStatus = event.value;
    this.getTransactions();
  }

  onFilterDateChange(dateFilter: any) {
    this.selectedFilterDate = dateFilter;
    this.getTransactions();
  }

  actionEvent(e: any) {
    const { action } = e.action;
    const transaction = e.element;

    // switch (action) {
    //   case 'edit':
    //     this.router.navigate(['portal/purchase-order/edit/' + e.element._id]);
    //     break;
    //   case 'print':
    //     this._print(e.element);
    //     break;
    // }
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getTransactions(true);
  }

  exportTableExcel() {
    const loadingMsg = 'Downloading Excel File...';
    this._setLoadingState(true, loadingMsg);

    const query: QueryParams = {
      searchText: this.query.searchText,
      status: this.query.status,
      date: this.query.date,
    };

    this.transactionApi.exportExcelTransactions(query).subscribe({
      next: (response: any) => {
        this._setLoadingState(false);
        const fileName = generateFileName('TRANSACTION', 'xlsx');
        this.fileApi.downloadFile(response.body as Blob, fileName);
      },
      error: ({ error }: HttpErrorResponse) => {
        this._setLoadingState(false);
        console.error(error);
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }

  private setQuery(isPageEvent: boolean) {
    const status =
      this.selectedFilterStatus === 'All' ? '' : this.selectedFilterStatus;

    const date =
      this.selectedFilterDate === DateFilterType.ALL_TIME
        ? ''
        : this.selectedFilterDate;

    const pageIndex = isPageEvent ? this.page.pageIndex : 0;
    const searchText = this.searchText.value ?? '';
    const sort = this.sortBy;

    this.query = {
      searchText,
      status,
      sort,
      date,
      pageIndex,
      pageSize: this.page.pageSize,
    };
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

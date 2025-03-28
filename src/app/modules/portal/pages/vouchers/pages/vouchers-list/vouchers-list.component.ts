import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { DateFilterType } from '@app/core/enums/date-filter.enum';
import {
  VOUCHER_STATUSES,
  VoucherStatus,
} from '@app/core/enums/voucher-status.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Voucher } from '@app/core/models/voucher.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { VoucherApiService } from '@app/shared/services/api/voucher-api/voucher-api.service';
import { FileService } from '@app/shared/services/file/file.service';
import { generateFileName } from '@app/shared/utils/stringUtil';
import { VoucherDataService } from '../upsert-voucher/voucher-data.service';
import { ChangeStatusModalComponent } from './components/change-status-modal/change-status-modal.component';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrl: './vouchers-list.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class VouchersListComponent {
  placeholder = 'Search Voucher No | Payee';
  searchText: FormControl = new FormControl('');

  statusControl = new FormControl('All');
  tableFilterStatuses = ['All', ...VOUCHER_STATUSES];
  selectedFilterStatus = 'All';
  selectedFilterDate = DateFilterType.ALL_TIME;

  isLoading = false;

  vouchers!: Voucher[];
  columns: TableColumn[] = [
    {
      label: 'Voucher No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Payee',
      dotNotationPath: 'payee',
      type: ColumnType.STRING,
    },
    {
      label: 'Check No',
      dotNotationPath: 'checkNo',
      type: ColumnType.STRING,
    },
    {
      label: 'Check Date',
      dotNotationPath: 'checkDate',
      type: ColumnType.DATE,
    },
    {
      label: 'Account Total',
      dotNotationPath: 'accountsTotal',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Bank',
      dotNotationPath: 'bank',
      type: ColumnType.CUSTOM,
      display: (element: any) => {
        return element.bank === 'OTHERS' ? element.specificBank : element.bank;
      },
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          color: Color.SUCCESS,
          value: VoucherStatus.ACTIVE,
        },
        {
          color: Color.INFO,
          value: VoucherStatus.RELEASE,
        },
        {
          color: Color.INFO,
          value: VoucherStatus.PENDING,
        },
        {
          color: Color.INFO,
          value: VoucherStatus.LIQUIDATED,
        },
        {
          color: Color.ERROR,
          value: VoucherStatus.DELETED,
        },
        {
          color: Color.ERROR,
          value: VoucherStatus.CANCELLED,
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
          name: 'Print Voucher',
          action: 'print',
          icon: 'print',
          color: Color.DEAD,
        },
        {
          name: 'Edit Voucher',
          action: 'edit',
          icon: 'edit',
          color: Color.WARNING,
        },
        {
          name: 'Change Voucher Status',
          action: 'change_status',
          icon: 'autorenew',
          color: Color.WARNING,
        },
        {
          name: 'Reuse Voucher',
          action: 'clone',
          icon: 'content_copy',
          color: Color.INFO,
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
    private voucherApi: VoucherApiService,
    private fileApi: FileService,
    private voucherData: VoucherDataService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.getVouchers();
  }

  getVouchers(isPageEvent = false) {
    const loadingMsg = 'Fetching expenses...';
    this.setQuery(isPageEvent);

    this._setLoadingState(true, loadingMsg);

    this.voucherApi.getVouchers(this.query).subscribe({
      next: (resp) => {
        this._setLoadingState(false);
        const response = resp as HttpGetResponse;
        this.vouchers = response.records as Voucher[];
        this.page.length = response.total;
      },
      error: (err: HttpErrorResponse) => {
        this._setLoadingState(false);
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message,
        );
      },
    });
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

  actionEvent(e: any) {
    const { action } = e.action;
    const voucher = e.element;

    switch (action) {
      case 'edit':
        this.router.navigate([PORTAL_PATHS.vouchers.editUrl, voucher._id]);
        break;
      case 'print':
        this._print(voucher);
        break;
      case 'clone':
        this.voucherData.setVoucher(voucher);
        this.router.navigate([PORTAL_PATHS.vouchers.createUrl]);
        break;
      case 'change_status':
        this._openChangeStatusModal(voucher);
        break;
    }
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getVouchers(true);
  }

  exportTableExcel() {
    const loadingMsg = 'Downloading Excel File...';
    this._setLoadingState(true, loadingMsg);

    const query: QueryParams = {
      searchText: this.query.searchText,
      status: this.query.status,
      date: this.query.date,
    };

    this.voucherApi.exportExcelVouchers(query).subscribe({
      next: (response: any) => {
        this._setLoadingState(false);
        const fileName = generateFileName('VOUCHER', 'xlsx');
        this.fileApi.downloadFile(response.body as Blob, fileName);
      },
      error: ({ error }: HttpErrorResponse) => {
        this._setLoadingState(false);
        console.error(error);
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }

  onFilterStatusChange(event: MatSelectChange) {
    this.selectedFilterStatus = event.value;
    this.getVouchers();
  }

  onFilterDateChange(dateFilterType: any) {
    this.selectedFilterDate = dateFilterType;
    this.getVouchers();
  }

  private _print(voucher: Voucher) {
    if (!voucher._id) return;
    this.dialog.open(PdfViewerComponent, {
      data: {
        apiCall: this.voucherApi.getVoucherPdfReceipt(voucher._id),
        title: 'View Voucher Receipt',
      },
      maxWidth: '70rem',
      width: '100%',
      disableClose: true,
      autoFocus: false,
    });
  }

  private _openChangeStatusModal(voucher: Voucher) {
    const config: MatDialogConfig = {
      data: voucher,
      autoFocus: false,
      disableClose: true,
      width: '45%',
    };

    this.dialog
      .open(ChangeStatusModalComponent, config)
      .afterClosed()
      .subscribe({
        next: (hasUpdate: boolean) => {
          if (hasUpdate) {
            this.getVouchers();
          }
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

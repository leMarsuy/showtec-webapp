import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { Status } from '@app/core/enums/status.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Voucher } from '@app/core/models/voucher.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { VoucherApiService } from '@app/shared/services/api/voucher-api/voucher-api.service';
import { VoucherDataService } from '../upsert-voucher/voucher-data.service';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { generateFileName } from '@app/shared/utils/stringUtil';
import { FileService } from '@app/shared/services/file/file.service';
import { ChangeStatusModalComponent } from './components/change-status-modal/change-status-modal.component';
import {
  VOUCHER_STATUSES,
  VoucherStatus,
} from '@app/core/enums/voucher-status.enum';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrl: './vouchers-list.component.scss',
})
export class VouchersListComponent {
  placeholder = 'Search Voucher No | Payee';
  searchText: FormControl = new FormControl('');

  private sortBy = '-code.value'; //Voucher No, descending

  tableFilterStatuses = ['All', ...VOUCHER_STATUSES];
  tableFilterStatus = 'All';
  downloading = false;

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
      type: ColumnType.STRING,
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
          color: Color.ERROR,
          value: VoucherStatus.DELETED,
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

  constructor(
    private voucherApi: VoucherApiService,
    private fileApi: FileService,
    private voucherData: VoucherDataService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.getVouchers();
  }

  onFilterStatusChange(status: Status | string) {
    this.tableFilterStatus = status;
    this.getVouchers();
  }

  getVouchers() {
    const status =
      this.tableFilterStatus === 'All' ? '' : this.tableFilterStatus;

    this.snackbarService.openLoadingSnackbar(
      'Please Wait',
      'Fetching expenses...'
    );
    this.voucherApi
      .getVouchers(
        {
          searchText: this.searchText.value || '',
          sort: this.sortBy,
          ...this.page,
        },
        status
      )
      .subscribe({
        next: (resp) => {
          var response = resp as HttpGetResponse;
          this.snackbarService.closeLoadingSnackbar();
          this.vouchers = response.records as Voucher[];
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
    const voucher = e.element;

    switch (action) {
      case 'edit':
        this.router.navigate(['portal', 'vouchers', 'edit', voucher._id]);
        break;
      case 'print':
        this._print(voucher);
        break;
      case 'clone':
        this.voucherData.setVoucher(voucher);
        this.router.navigate(['portal', 'vouchers', 'create']);
        break;
      case 'change_status':
        this._openChangeStatusModal(voucher);
        break;
    }
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getVouchers();
  }

  exportTableExcel() {
    this.snackbarService.openLoadingSnackbar(
      'Please Wait',
      'Downloading Excel file...'
    );
    this.downloading = true;

    const status =
      this.tableFilterStatus === 'All' ? '' : this.tableFilterStatus;

    const query: QueryParams = {
      searchText: this.searchText.value || '',
    };

    this.voucherApi.exportExcelVouchers(query, status).subscribe({
      next: (response: any) => {
        this.downloading = false;
        this.snackbarService.closeLoadingSnackbar();
        const fileName = generateFileName('VOUCHER', 'xlsx');
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
}

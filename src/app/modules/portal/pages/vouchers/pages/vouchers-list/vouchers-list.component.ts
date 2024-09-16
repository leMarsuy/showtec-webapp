import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { Status, STATUS_TYPES } from '@app/core/enums/status.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Voucher } from '@app/core/models/voucher.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { VoucherApiService } from '@app/shared/services/api/voucher-api/voucher-api.service';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrl: './vouchers-list.component.scss',
})
export class VouchersListComponent {
  placeholder = 'Search for Voucher No.';
  searchText: FormControl = new FormControl('');

  tableFilterStatuses = ['All', ...STATUS_TYPES];
  tableFilterStatus = 'All';

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
      label: 'Account Total',
      dotNotationPath: 'accountsTotal',
      type: ColumnType.STRING,
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
          value: Status.ACTIVE,
        },
        {
          color: Color.DEAD,
          value: Status.INACTIVE,
        },
        {
          color: Color.ERROR,
          value: Status.DELETED,
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
          name: 'edit',
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

  constructor(
    private voucherApi: VoucherApiService,
    private snackbarService: SnackbarService,
    private router: Router
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
    const { action } = e;

    switch (action.name) {
      case 'edit':
        this.router.navigate(['portal/vouchers/edit/' + e.element._id]);
        break;
    }
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getVouchers();
  }
}

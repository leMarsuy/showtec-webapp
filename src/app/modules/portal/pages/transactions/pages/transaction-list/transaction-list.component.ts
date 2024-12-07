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
import { PAYMENT_STATUSES } from '@app/core/enums/payment-status.enum';
import { PurchaseOrderStatus } from '@app/core/enums/purchase-order.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';

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
  selectedFilterDate = DateFilterType.ALL_TIME;

  transactions!: any; // TRANSACTION interface
  columns: TableColumn[] = [
    {
      label: 'SOA No.',
      dotNotationPath: 'code.value',
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

  constructor(
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  getTransactions() {}

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
    this.getTransactions();
  }
}

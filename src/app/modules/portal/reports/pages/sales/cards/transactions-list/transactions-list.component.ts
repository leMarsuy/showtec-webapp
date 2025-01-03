import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { PaymentMethod } from '@app/core/enums/payment-method.enum';
import { PaymentStatus } from '@app/core/enums/payment-status.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { SalesAnalyticsService } from '@app/shared/services/analytics/sales-analytics/sales-analytics.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss',
})
export class TransactionsListComponent implements OnInit {
  transactions: Array<any> = [];
  pagedTransactions: Array<any> = [];

  @Input() dateFrom!: Date;
  @Input() dateTo!: Date;

  columns: TableColumn[] = [
    {
      label: 'SOA No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'transactions.status',
      type: ColumnType.STATUS,
      colorCodes: [
        { value: PaymentStatus.COMPLETED, color: Color.SUCCESS },
        { value: PaymentStatus.PENDING, color: Color.INFO },
        { value: PaymentStatus.FAILED, color: Color.ERROR },
      ],
    },
    {
      label: 'Name',
      dotNotationPath: 'STATIC.name',
      type: ColumnType.STRING,
    },
    {
      label: 'Type',
      dotNotationPath: 'transactions.paymentMethod',
      type: ColumnType.STATUS,
      colorCodes: [
        { value: PaymentMethod.CASH, color: Color.SUCCESS },
        { value: PaymentMethod.CHECK, color: Color.INFO },
        { value: PaymentMethod.BANK_TRANSFER, color: Color.WARNING },
      ],
    },
    {
      label: 'C/N or Ref#',
      dotNotationPath: ['transactions.checkNo', 'transactions.referenceNo'],
      type: ColumnType.STRING,
    },
    {
      label: 'Amount',
      dotNotationPath: 'transactions.amount',
      type: ColumnType.NUMBER,
    },
    {
      label: 'Issuing Bank',
      dotNotationPath: 'transactions.issuingBank',
      type: ColumnType.STRING,
    },

    {
      label: 'Company Bank',
      dotNotationPath: 'transactions.bank',
      type: ColumnType.STRING,
    },
  ];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };

  constructor(public saleAnalytics: SalesAnalyticsService) {}

  fetchTransactions() {
    this.saleAnalytics.getTransactions(this.dateFrom, this.dateTo).subscribe({
      next: (data: any) => {
        this.transactions = data.records;
        this.page.length = data.total;
        this.pageEventHandler(this.page);
      },
    });
  }

  pageEventHandler(e: PageEvent) {
    this.page = e;
    var skip = this.page.pageSize * this.page.pageIndex;
    this.pagedTransactions = this.transactions.slice(
      skip,
      skip + this.page.pageSize,
    );

    // this.pagedTransactions = [...this.pagedTransactions];
  }

  ngOnInit(): void {
    this.fetchTransactions();
  }
}

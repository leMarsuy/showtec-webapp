import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Expense } from '@app/core/models/expense.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ExpenseApiService } from '@app/shared/services/api/expense-api/expense-api.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  // in page

  searchText = new FormControl('');

  // content header

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Add Expense',
      icon: 'add',
    },
  ];

  // table module

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 50,
    length: -1,
  };

  columns: TableColumn[] = [
    { label: 'Code', dotNotationPath: 'code', type: ColumnType.STRING },
    { label: 'Company', dotNotationPath: 'name', type: ColumnType.STRING },
    {
      label: 'Contact Person',
      dotNotationPath: 'contactPerson',
      type: ColumnType.STRING,
    },
    { label: 'Email', dotNotationPath: 'email', type: ColumnType.STRING },
    { label: 'Mobile No.', dotNotationPath: 'mobile', type: ColumnType.STRING },
  ];
  suppliers: Expense[] = [];

  constructor(
    private dialog: MatDialog,
    private supplierApi: ExpenseApiService,
    private snackbarService: SnackbarService
  ) {
    this.getExpenses();
  }

  openAddExpense() {
    // this.dialog
    //   .open(AddExpenseComponent, {
    //     width: '100rem',
    //     disableClose: true,
    //   })
    //   .afterClosed()
    //   .subscribe((refresh: boolean) => {
    //     if (refresh) this.getExpenses();
    //   });
  }

  openEditExpense(_id: string) {
    // this.dialog
    //   .open(EditExpenseComponent, {
    //     width: '100rem',
    //     disableClose: true,
    //     data: { _id },
    //   })
    //   .afterClosed()
    //   .subscribe((refresh: boolean) => {
    //     if (refresh) this.getExpenses();
    //   });
  }

  getExpenses() {
    this.snackbarService.openLoadingSnackbar(
      'GetData',
      'Fetching suppliers...'
    );
    this.supplierApi
      .getExpenses({
        searchText: this.searchText.value || '',
        ...this.page,
      })
      .subscribe({
        next: (resp) => {
          var response = resp as HttpGetResponse;
          this.snackbarService.closeLoadingSnackbar();
          this.suppliers = response.records as Expense[];
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

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getExpenses();
  }

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.openAddExpense();
    }
  }
}

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
import { EXPENSES_CONFIG } from './expenses-config';
import { PaymentStatus } from '@app/core/enums/payment-status.enum';
import { UpsertExpenseComponent } from './upsert-expense/upsert-expense.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  searchText = new FormControl('');

  actions: ContentHeaderAction[];
  tableFilterStatuses: Array<PaymentStatus | string>;
  tableFilterStatus: PaymentStatus | string = 'All';

  // table module
  expenses: Expense[] = [];
  columns: TableColumn[];
  page: PageEvent = {
    pageIndex: 0,
    pageSize: 50,
    length: -1,
  };

  placeholder: string;
  icon: string;

  dialogProps: any;
  constructor(
    private dialog: MatDialog,
    private expenseApi: ExpenseApiService,
    private snackbarService: SnackbarService
  ) {
    this.getExpenses();

    this.actions = EXPENSES_CONFIG.headerActions;
    this.columns = EXPENSES_CONFIG.tableColumns;
    this.tableFilterStatuses = EXPENSES_CONFIG.tableFilters.statuses;

    this.placeholder = EXPENSES_CONFIG.tableFilters.searchPlaceHolder;
    this.icon = EXPENSES_CONFIG.tableFilters.searchIcon;
    this.dialogProps = EXPENSES_CONFIG.dialogProps;
  }

  onAddExpenseClick() {
    this.openUpsertDialog().subscribe((result) => {
      if (result) this.getExpenses();
    });
  }

  onSelectExpense(expense: Expense) {
    this.openUpsertDialog(expense).subscribe((result) => {
      if (result) this.getExpenses();
    });
  }

  onFilterStatusChange(status: PaymentStatus | string) {
    this.tableFilterStatus = status;
    this.getExpenses();
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getExpenses();
  }

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.onAddExpenseClick();
    }
  }

  openUpsertDialog(expenseToUpdate?: Expense) {
    return this.dialog
      .open(UpsertExpenseComponent, {
        width: '50%',
        disableClose: true,
        data: {
          expense: expenseToUpdate,
          upsertDialongProps: this.dialogProps,
        },
      })
      .afterClosed()
      .pipe(filter((result) => result));
  }

  getExpenses() {
    const status =
      this.tableFilterStatus === 'All' ? '' : this.tableFilterStatus;

    this.snackbarService.openLoadingSnackbar(
      EXPENSES_CONFIG.loadingExpenseTitle,
      EXPENSES_CONFIG.loadingExpenseMsg
    );
    this.expenseApi
      .getExpenses(
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
          this.expenses = response.records as Expense[];
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
}

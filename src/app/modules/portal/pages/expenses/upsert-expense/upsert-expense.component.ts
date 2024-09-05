import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expense } from '@app/core/models/expense.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ExpenseApiService } from '@app/shared/services/api/expense-api/expense-api.service';
import { filter, switchMap } from 'rxjs';

export interface UpsertExpenseProps {
  expense?: Expense;
  upsertDialongProps: any;
}

export interface UpsertExpenseConfirmationProps {
  title: string;
  message: string;
}

@Component({
  selector: 'app-upsert-expense',
  templateUrl: './upsert-expense.component.html',
  styleUrl: './upsert-expense.component.scss',
})
export class UpsertExpenseComponent {
  expenseForm!: FormGroup;
  isUpdate: boolean;
  config: any;
  expense: any;

  props: UpsertExpenseConfirmationProps;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UpsertExpenseProps,
    private snackbarService: SnackbarService,
    private expenseApi: ExpenseApiService,
    private confirmationApi: ConfirmationService,
    private _dialogRef: MatDialogRef<UpsertExpenseComponent>
  ) {
    this.expense = this.data.expense;
    this.isUpdate = !!this.data.expense;

    const { createDialog, updateDialog } = this.data.upsertDialongProps;
    this.config = this.isUpdate ? updateDialog : createDialog;
    this.props = this.config.confirmationDialog;
  }

  formEventHandler(e: FormGroup) {
    this.expenseForm = e;
  }

  onSubmit() {
    // const expense = this.expenseForm.getRawValue() as Expense;

    this.confirmationApi
      .open(this.props.title, this.props.message)
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.expenseForm.disable();
          const expense = this.expenseForm.getRawValue() as Expense;
          this.snackbarService.openLoadingSnackbar(
            this.config.loadingTitle,
            this.config.loadingMessage
          );

          if (this.isUpdate) {
            return this.expenseApi.updateExpenseById(this.expense._id, expense);
          }
          return this.expenseApi.createExpense(expense);
        })
      )
      .subscribe({
        next: () => {
          this.snackbarService.closeLoadingSnackbar().then(() => {
            this._dialogRef.close(true);
          });
        },
        error: (err: HttpErrorResponse) => {
          this.snackbarService.closeLoadingSnackbar().then(() => {
            this.expenseForm.enable();
            this.snackbarService.openErrorSnackbar(
              err.error?.errorCode,
              err.error?.message
            );
          });
        },
      });
  }
}

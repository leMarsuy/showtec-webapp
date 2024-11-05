import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';
import { UpsertPayeeComponent } from './components/upsert-payee/upsert-payee.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Payee } from '@app/core/models/payee.model';
import { PayeeApiService } from '@app/shared/services/api/payee-api/payee-api.service';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { Status, STATUS_TYPES } from '@app/core/enums/status.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-payees',
  templateUrl: './payees.component.html',
  styleUrl: './payees.component.scss',
})
export class PayeesComponent {
  // Content Header
  icon = NavIcon.PAYEES;
  label = 'PAYEES';

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Add Payee',
      icon: 'add',
    },
  ];

  tableFilterStatuses = [Status.ACTIVE, Status.DELETED];
  selectedFilterStatus = Status.ACTIVE;
  // Content Table
  private readonly sortBy = 'name';

  placeholder = 'Search Payee';
  searchText = new FormControl('');

  isLoading = false;

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  payees!: Payee[];
  columns: TableColumn[] = [
    {
      label: 'Payee',
      dotNotationPath: 'name',
      type: ColumnType.STRING,
    },
    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'Edit Payee',
          action: 'edit',
          icon: 'edit',
          color: Color.WARNING,
          showIfCondition: {
            status: Status.ACTIVE,
          },
        },
        {
          name: 'Delete Payee',
          action: 'delete',
          icon: 'delete',
          color: Color.ERROR,
          showIfCondition: {
            status: Status.ACTIVE,
          },
        },
        {
          name: 'Reactivate Payee',
          action: 'reactivate',
          icon: 'autorenew',
          color: Color.WARNING,
          showIfCondition: {
            status: Status.DELETED,
          },
        },
      ],
    },
  ];

  constructor(
    private readonly payeeApi: PayeeApiService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly snackbar: SnackbarService,
    private readonly confirmation: ConfirmationService
  ) {
    this.getPayees();
  }

  getPayees() {
    const status = this.selectedFilterStatus;
    const loadingMsg = 'Fetching payees...';
    this._setLoadingState(true, loadingMsg);

    this.payeeApi
      .getPayees(
        {
          searchText: this.searchText.value ?? '',
          sort: this.sortBy,
          ...this.page,
        },
        status
      )
      .subscribe({
        next: (resp: any) => {
          this._setLoadingState(false);
          const response = resp as HttpGetResponse;
          this.payees = response.records as Payee[];
          this.page.length = response.total;
        },
        error: ({ error }: HttpErrorResponse) => {
          this._setLoadingState(false);
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  /**
   *  @param status {"Active" || "Deleted"}
   */
  onFilterStatusChange(status: Status) {
    this.selectedFilterStatus = status as Status;
    this.getPayees();
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getPayees();
  }

  /**
   * @param action {Action.action}
   */
  headerActionEvent(action: string) {
    switch (action) {
      case 'add':
        this._openUpsertPayeeDialog();
        break;
    }
  }

  /**
   * @param e {action: Action, element: Payee}
   */
  tableActionEvent(e: any) {
    const { action } = e.action;
    const payee = e.element;

    switch (action) {
      case 'edit':
        this._openUpsertPayeeDialog(payee);
        break;
      case 'delete':
        this._onChangePayeeStatus(payee._id, Status.DELETED, 'delete');
        break;
      case 'reactivate':
        this._onChangePayeeStatus(payee._id, Status.ACTIVE, 'activate');
        break;
    }
  }

  /**
   * @param payee {Payee}
   * @param status {"Active" || "Deleted"}
   */
  private _onChangePayeeStatus(
    payeeId: string,
    status: Status.ACTIVE | Status.DELETED,
    action: string
  ) {
    const confirmMsg = `Do you want to ${action} this payee?`;

    this.confirmation
      .open('Action Confirmation', confirmMsg)
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this._setLoadingState(true, 'Updating Payee Status');
          return this.payeeApi.patchPayeeStatusById(payeeId, status);
        })
      )
      .subscribe({
        next: (response: any) => {
          this._setLoadingState(false);
          if (response) {
            this.getPayees();
          }
        },
        error: ({ error }: HttpErrorResponse) => {
          this._setLoadingState(false);
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  private _openUpsertPayeeDialog(payee = undefined) {
    this.dialog
      .open(UpsertPayeeComponent, {
        data: payee,
        autoFocus: false,
        disableClose: true,
        width: '55vw',
      })
      .afterClosed()
      .subscribe({
        next: (hasUpdate: boolean) => {
          if (hasUpdate) {
            this.getPayees();
          }
        },
        error: ({ error }: HttpErrorResponse) => {
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  private _setLoadingState(isLoading: boolean, loadingMsg = '') {
    this.isLoading = isLoading;

    if (isLoading) {
      this.snackbar.openLoadingSnackbar('Please Wait', loadingMsg);
    } else {
      this.snackbar.closeLoadingSnackbar();
    }
  }
}

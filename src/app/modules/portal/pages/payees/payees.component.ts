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
        },
      ],
    },
  ];

  constructor(
    private readonly payeeApi: PayeeApiService,
    private readonly snackbar: SnackbarService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {
    this.getPayees();
  }

  getPayees() {
    const loadingMsg = 'Fetching expenses...';

    this._setLoadingState(true, loadingMsg);

    this.payeeApi
      .getPayees({
        searchText: this.searchText.value ?? '',
        sort: this.sortBy,
        ...this.page,
      })
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

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getPayees();
  }

  headerActionEvent(action: string) {
    switch (action) {
      case 'add':
        this._openUpsertPayeeDialog();
        break;
    }
  }

  tableActionEvent(e: any) {
    const { action } = e.action;
    const payee = e.element;

    switch (action) {
      case 'edit':
        this._openUpsertPayeeDialog(payee);
        break;
    }
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

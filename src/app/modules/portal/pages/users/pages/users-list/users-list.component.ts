import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { Status, STATUS_TYPES } from '@app/core/enums/status.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { User } from '@app/core/models/user.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { capitalizeFirstLetter } from '@app/shared/utils/stringUtil';
import { filter, switchMap } from 'rxjs';
import { EditUserComponent } from '../../component/edit-user/edit-user.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  searchText = new FormControl('');
  page: PageEvent = {
    pageIndex: 0,
    pageSize: 50,
    length: -1,
  };

  query: QueryParams = {
    pageIndex: 0,
    pageSize: 50,
  };

  statusControl: any = new FormControl(Status.ACTIVE);
  tableFilterStatuses = ['All', ...STATUS_TYPES];

  columns: TableColumn[] = [
    { label: 'Name', dotNotationPath: 'name', type: ColumnType.STRING },
    { label: 'Email', dotNotationPath: 'email', type: ColumnType.STRING },
    {
      label: 'Designation',
      dotNotationPath: 'designation',
      type: ColumnType.STRING,
    },
    {
      label: 'Role',
      dotNotationPath: '_roleId.name',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          value: Status.ACTIVE,
          color: Color.SUCCESS,
        },
        {
          value: Status.DELETED,
          color: Color.ERROR,
        },
        {
          value: Status.INACTIVE,
          color: Color.WARNING,
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
          name: 'Send Reset Password',
          action: 'send-reset-password',
          icon: 'mail_lock',
          color: Color.DEAD,
          showIfCondition: {
            status: Status.ACTIVE,
          },
        },
        {
          name: 'Edit User',
          action: 'edit',
          icon: 'edit',
          color: Color.WARNING,
        },
        {
          name: 'Suspend User',
          icon: 'block',
          action: 'suspend',
          color: Color.WARNING,
          showIfCondition: {
            status: Status.ACTIVE,
          },
        },
        {
          name: 'Delete User',
          icon: 'delete',
          action: 'delete',
          color: Color.ERROR,
          showIfCondition: {
            $or: [{ status: Status.INACTIVE }, { status: Status.ACTIVE }],
          },
        },
        {
          name: 'Reactivate User',
          icon: 'person',
          action: 'reactivate',
          color: Color.SUCCESS,
          showIfCondition: {
            $or: [{ status: Status.INACTIVE }, { status: Status.DELETED }],
          },
        },
      ],
    },
  ];
  users: User[] = [];

  constructor(
    private userApi: UserApiService,
    private authApi: AuthService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private confirmationService: ConfirmationService,
  ) {
    this.getUsers();
  }

  public getUsers(isPageEvent = false) {
    this.snackbarService.openLoadingSnackbar('GetData', 'Fetching users...');
    this.setQuery(isPageEvent);

    this.userApi.getUsers(this.query).subscribe({
      next: (resp) => {
        const response = resp as HttpGetResponse;
        this.snackbarService.closeLoadingSnackbar();
        this.users = response.records as User[];
        this.page.length = response.total;
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message,
        );
      },
    });
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getUsers(true);
  }

  actionEvent(e: any) {
    const { action } = e.action;
    const user = e.element;

    switch (action) {
      case 'edit':
        this._openEditUser(user);
        break;
      case 'suspend':
        this._changeUserStatus(user, Status.INACTIVE, action);
        break;
      case 'reactivate':
        this._changeUserStatus(user, Status.ACTIVE, action);
        break;
      case 'delete':
        this._changeUserStatus(user, Status.DELETED, action);
        break;
      case 'send-reset-password':
        this._sendUserResetPassword(user);
        break;
    }
  }

  onFilterStatusChange(event: MatSelectChange) {
    this.statusControl.setValue(event.value);
    this.getUsers();
  }

  private _sendUserResetPassword(user: User) {
    this.confirmationService
      .open(
        'Send User Reset Password',
        `Do you want to request password reset for <b>${user.name}</b>?`,
      )
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.snackbarService.openLoadingSnackbar(
            'Sending to User Email',
            'Please wait...',
          );
          return this.authApi.forgotPassword(user.email);
        }),
      )
      .subscribe({
        next: () => {
          this.snackbarService.closeLoadingSnackbar();
          this.snackbarService.openSuccessSnackbar('Email has been sent!');
        },
        error: ({ error }) => {
          console.error(error);
          this.snackbarService.openErrorSnackbar(
            error.errorCode,
            error.message,
          );
        },
      });
  }

  private _changeUserStatus(user: User, status: Status, action: string) {
    const titleAction = capitalizeFirstLetter(action);
    this.confirmationService
      .open(
        `${titleAction} User`,
        this._formatConfirmationMessage(user) +
          `<br>Do you want to ${action} this user?`,
      )
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.snackbarService.openLoadingSnackbar(
            'Applying changes',
            'Please wait...',
          );
          return this.userApi.patchUserStatus(user._id, status);
        }),
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.snackbarService.closeLoadingSnackbar();
            this.snackbarService.openSuccessSnackbar(
              `Status Change Success`,
              'User status has been updated',
            );
            setTimeout(() => {
              this.getUsers();
            }, 500);
          }
        },
        error: ({ error }: HttpErrorResponse) => {
          this.snackbarService.closeLoadingSnackbar();
          console.error(error);
          this.snackbarService.openErrorSnackbar(
            error.errorCode,
            error.message,
          );
        },
      });
  }

  private _openEditUser(user: User) {
    this.dialog
      .open(EditUserComponent, {
        width: '100rem',
        disableClose: true,
        data: user,
      })
      .afterClosed()
      .subscribe((refresh: boolean) => {
        if (refresh) this.getUsers();
      });
  }

  private _formatConfirmationMessage(user: User) {
    return `<p>Name: <span class='ml-2 font-bold'>${user.name}</span></p><p>Email: <span class='ml-2 font-bold'>${user.email}</span></p><p>Designation: <span class='ml-2 font-bold'>${user.designation}</span></p>`;
  }

  private setQuery(isPageEvent = false) {
    const pageIndex = isPageEvent ? this.page.pageIndex : 0;

    const searchText = this.searchText.value ?? '';
    const status =
      this.statusControl.value === 'All' ? '' : this.statusControl.value;

    this.query = {
      searchText,
      pageIndex,
      pageSize: this.page.pageSize,
      status,
    };
  }
}

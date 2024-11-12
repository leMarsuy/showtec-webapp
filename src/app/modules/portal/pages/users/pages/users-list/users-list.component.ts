import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { User } from '@app/core/models/user.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
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

  columns: TableColumn[] = [
    { label: 'Name', dotNotationPath: 'name', type: ColumnType.STRING },
    { label: 'Email', dotNotationPath: 'email', type: ColumnType.STRING },
    {
      label: 'Designation',
      dotNotationPath: 'designation',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STRING,
    },
    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'Edit User',
          action: 'edit',
          icon: 'edit',
          color: Color.WARNING,
        },
      ],
    },
  ];
  users: User[] = [];

  constructor(
    private snackbarService: SnackbarService,
    private userApi: UserApiService,
    private dialog: MatDialog
  ) {
    this.getUsers();
  }

  public getUsers() {
    this.snackbarService.openLoadingSnackbar('GetData', 'Fetching users...');
    this.userApi
      .getUsers({
        searchText: this.searchText.value || '',
        ...this.page,
      })
      .subscribe({
        next: (resp) => {
          var response = resp as HttpGetResponse;
          this.snackbarService.closeLoadingSnackbar();
          this.users = response.records as User[];
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
    this.getUsers();
  }

  actionEvent(e: any) {
    const { action } = e.action;
    const user = e.element;

    switch (action) {
      case 'edit':
        this._openEditUser(user);
        break;
    }
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
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { User } from '@app/core/models/user.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';

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
  ];
  users: User[] = [];

  constructor(
    private snackbarService: SnackbarService,
    private userApi: UserApiService
  ) {
    this.getUsers();
  }

  getUsers() {
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

  openEditUser(_id: string) {
    // this.dialog
    //   .open(EditSupplierComponent, {
    //     width: '100rem',
    //     disableClose: true,
    //     data: { _id },
    //   })
    //   .afterClosed()
    //   .subscribe((refresh: boolean) => {
    //     if (refresh) this.getSuppliers();
    //   });
  }
}

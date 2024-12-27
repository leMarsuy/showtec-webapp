import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { Status } from '@app/core/enums/status.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Role } from '@app/core/models/role.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { RoleApiService } from '@app/shared/services/api/role-api/role-api.service';
import { Store } from '@ngrx/store';
import { finalize, Subject, takeUntil } from 'rxjs';
import { RolesService } from '../../roles.service';
import { UpsertRoleComponent } from '../upsert-role/upsert-role.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class RoleListComponent implements OnInit, OnDestroy {
  readonly placeholder = 'Search Role';
  searchText: FormControl = new FormControl('');

  private sortBy = 'name'; //Role Name, ascending
  private _destroyed$ = new Subject<void>();

  statusControl = new FormControl(Status.ACTIVE);
  tableFilterStatuses = ['All', Status.ACTIVE, Status.DELETED];
  selectedFilterStatus: any = this.statusControl.value;


  isLoading = false;
  isDateRange = false;

  roles!: Role[];
  columns: TableColumn[] = [
    {
      label: 'Role Name',
      dotNotationPath: 'name',
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
      ]
    },
    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'Edit Role',
          action: 'edit',
          icon: 'edit',
          color: Color.WARNING,
          showIfCondition: {
            status: Status.ACTIVE
          }
        },
        // {
        //   name: 'Change Role Status',
        //   action: 'change_status',
        //   icon: 'autorenew',
        //   color: Color.WARNING,
        // },
      ],
    },
  ];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  query: QueryParams = {
    pageIndex: 0,
    pageSize: 10,
  };

  constructor(
    private roleApi: RoleApiService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private rolesService: RolesService,
    private store: Store
  ) {
    this.getRoles();
  }

  ngOnInit(): void {
    this.rolesService.fetchRoles$
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        this.getRoles();
      });
  }

  getRoles(isPageEvent = false) {
    this._setLoadingState(true, 'Fetching roles...');

    this.setQuery(isPageEvent);

    this.roleApi
      .getRoles(this.query)
      .pipe(finalize(() => this._setLoadingState(false)))
      .subscribe({
        next: (response) => {
          const resp = response as HttpGetResponse;
          this.roles = resp.records as Role[];
          this.page.length = resp.total;
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
    this.getRoles(true);
  }

  actionEvent(e: any) {
    const { action } = e.action;
    const role = e.element;

    switch (action) {
      case 'edit':
        this._openEditRole(role);
        break;

      // case 'change_status':
      //   this._openChangeStatusModal(voucher);
      //   break;
    }
  }

  onFilterStatusChange(event: MatSelectChange) {
    this.selectedFilterStatus = event.value;
    this.getRoles();
  }

  private _openEditRole(role: Role) {
    this.dialog
      .open(UpsertRoleComponent, {
        data: role,
        width: '55vw',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getRoles();
        }
      });
  }

  private setQuery(isPageEvent: boolean) {
    const status = this.selectedFilterStatus && this.selectedFilterStatus === 'All' ? '' : this.selectedFilterStatus;

    const pageIndex = isPageEvent ? this.page.pageIndex : 0;
    const searchText = this.searchText.value ?? '';
    const sort = this.sortBy;

    this.query = {
      searchText,
      status,
      sort,
      pageIndex,
      pageSize: this.page.pageSize,
    };
  }

  private _setLoadingState(isLoading: boolean, loadingMsg = '') {
    this.isLoading = isLoading;

    if (isLoading) {
      this.snackbarService.openLoadingSnackbar('Please Wait', loadingMsg);
    } else {
      this.snackbarService.closeLoadingSnackbar();
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

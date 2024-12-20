import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { DateFilterType } from '@app/core/enums/date-filter.enum';
import { STATUS_TYPES } from '@app/core/enums/status.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Role } from '@app/core/models/role.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { RoleApiService } from '@app/shared/services/api/role-api/role-api.service';
import { FileService } from '@app/shared/services/file/file.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { VoucherDataService } from '../../../vouchers/pages/upsert-voucher/voucher-data.service';
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

  statusControl = new FormControl('All');
  tableFilterStatuses = ['All', ...STATUS_TYPES];
  selectedFilterStatus = 'All';

  selectedFilterDate: any = DateFilterType.ALL_TIME;

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
    private fileApi: FileService,
    private voucherData: VoucherDataService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog,
    private rolesService: RolesService,
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

  onFilterDateChange(dateFilterType: any) {
    this.selectedFilterDate = dateFilterType;
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
    const status =
      this.selectedFilterStatus === 'All' ? '' : this.selectedFilterStatus;

    const date =
      this.selectedFilterDate === DateFilterType.ALL_TIME
        ? ''
        : this.selectedFilterDate;

    const pageIndex = isPageEvent ? this.page.pageIndex : 0;
    const searchText = this.searchText.value ?? '';
    const sort = this.sortBy;

    this.query = {
      searchText,
      status,
      sort,
      date,
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

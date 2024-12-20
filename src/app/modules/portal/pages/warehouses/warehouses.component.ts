import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HttpGetResponse } from '@core/interfaces/http-get-response.interface';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { WarehouseApiService } from '@shared/services/api/warehouse-api/warehouse-api.service';
import { ColumnType } from '@core/enums/column-type.enum';
import { ContentHeaderAction } from '@core/interfaces/content-header-action.interface';
import { Warehouse } from '@core/models/warehouse.model';
import { AddWarehouseComponent } from '../warehouses/add-warehouse/add-warehouse.component';
import { EditWarehouseComponent } from '../warehouses/edit-warehouse/edit-warehouse.component';
import { QueryParams } from '@app/core/interfaces/query-params.interface';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrl: './warehouses.component.scss',
})
export class WarehousesComponent {
  // in page

  searchText = new FormControl('');

  // content header

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Add Warehouse',
      icon: 'add',
    },
  ];

  // table module

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 50,
    length: -1,
  };

  query: QueryParams = {
    pageIndex: 0,
    pageSize: 50,
  };

  columns: TableColumn[] = [
    { label: 'Code', dotNotationPath: 'code', type: ColumnType.STRING },
    { label: 'Warehouse', dotNotationPath: 'name', type: ColumnType.STRING },
    { label: 'Address', dotNotationPath: 'address', type: ColumnType.STRING },
  ];
  warehouses: Warehouse[] = [];

  constructor(
    private dialog: MatDialog,
    private warehouseApi: WarehouseApiService,
    private snackbarService: SnackbarService,
  ) {
    this.getWarehouses();
  }

  openAddWarehouse() {
    this.dialog
      .open(AddWarehouseComponent, {
        width: '100rem',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((refresh: boolean) => {
        if (refresh) this.getWarehouses();
      });
  }

  openEditWarehouse(_id: string) {
    this.dialog
      .open(EditWarehouseComponent, {
        width: '100rem',
        disableClose: true,
        data: { _id },
      })
      .afterClosed()
      .subscribe((refresh: boolean) => {
        if (refresh) this.getWarehouses();
      });
  }

  getWarehouses(isPageEvent = false) {
    this.snackbarService.openLoadingSnackbar(
      'GetData',
      'Fetching warehouses...',
    );

    this.setQuery(isPageEvent);
    this.warehouseApi.getWarehouses(this.query).subscribe({
      next: (resp) => {
        const response = resp as HttpGetResponse;
        this.snackbarService.closeLoadingSnackbar();
        this.warehouses = response.records as Warehouse[];
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
    this.getWarehouses(true);
  }

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.openAddWarehouse();
    }
  }

  private setQuery(isPageEvent = false) {
    const pageIndex = isPageEvent ? this.page.pageIndex : 0;
    const searchText = this.searchText.value ?? '';
    this.query = {
      searchText,
      pageIndex,
      pageSize: this.page.pageSize,
    };
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HttpGetResponse } from '@core/interfaces/http-get-response.interface';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { Supplier } from '@core/models/supplier.model';
import { SupplierApiService } from '@shared/services/api/supplier-api/supplier-api.service';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { ColumnType } from '@core/enums/column-type.enum';
import { ContentHeaderAction } from '@core/interfaces/content-header-action.interface';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent {
  // in page

  searchText = new FormControl('');

  // content header

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Add Supplier',
      icon: 'add',
    },
  ];

  // table module

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 50,
    length: -1,
  };

  columns: TableColumn[] = [
    { label: 'Code', dotNotationPath: 'code', type: ColumnType.STRING },
    { label: 'Company', dotNotationPath: 'name', type: ColumnType.STRING },
    {
      label: 'Contact Person',
      dotNotationPath: 'contactPerson',
      type: ColumnType.STRING,
    },
    { label: 'Email', dotNotationPath: 'email', type: ColumnType.STRING },
    { label: 'Mobile No.', dotNotationPath: 'mobile', type: ColumnType.STRING },
  ];
  suppliers: Supplier[] = [];

  constructor(
    private dialog: MatDialog,
    private supplierApi: SupplierApiService,
    private snackbarService: SnackbarService
  ) {
    this.getSuppliers();
  }

  openAddSupplier() {
    this.dialog
      .open(AddSupplierComponent, {
        width: '100rem',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((refresh: boolean) => {
        if (refresh) this.getSuppliers();
      });
  }

  openEditSupplier(_id: string) {
    this.dialog
      .open(EditSupplierComponent, {
        width: '100rem',
        disableClose: true,
        data: { _id },
      })
      .afterClosed()
      .subscribe((refresh: boolean) => {
        if (refresh) this.getSuppliers();
      });
  }

  getSuppliers() {
    this.snackbarService.openLoadingSnackbar(
      'GetData',
      'Fetching suppliers...'
    );
    this.supplierApi
      .getSuppliers({
        searchText: this.searchText.value || '',
        ...this.page,
      })
      .subscribe({
        next: (resp) => {
          var response = resp as HttpGetResponse;
          this.snackbarService.closeLoadingSnackbar();
          this.suppliers = response.records as Supplier[];
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
    this.getSuppliers();
  }

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.openAddSupplier();
    }
  }
}

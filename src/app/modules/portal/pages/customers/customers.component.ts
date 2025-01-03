import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerApiService } from '@shared/services/api/customer-api/customer-api.service';
import { FormControl } from '@angular/forms';
import { Customer } from '@core/models/customer.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { HttpGetResponse } from '@core/interfaces/http-get-response.interface';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { PageEvent } from '@angular/material/paginator';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { ColumnType } from '@core/enums/column-type.enum';
import { ContentHeaderAction } from '@core/interfaces/content-header-action.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  // in page

  searchText = new FormControl('');

  // content header

  actions: ContentHeaderAction[] = [
    {
      label: 'Filter',
      icon: 'filter_alt',
      id: 'filter',
    },
    {
      label: 'Add Customer',
      icon: 'add',
      id: 'add',
    },
  ];

  // table modules

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
    { label: 'Entity', dotNotationPath: 'name', type: ColumnType.STRING },
    { label: 'Type', dotNotationPath: 'type', type: ColumnType.STRING },
    {
      label: 'Contact Person',
      dotNotationPath: 'contactPerson',
      type: ColumnType.STRING,
    },
    { label: 'Remarks', dotNotationPath: 'remarks', type: ColumnType.STRING },
    { label: 'Mobile No.', dotNotationPath: 'mobile', type: ColumnType.STRING },
  ];
  customers!: Customer[];

  constructor(
    private dialog: MatDialog,
    private customerApi: CustomerApiService,
    private snackbarService: SnackbarService,
  ) {
    this.getCustomers();
  }

  openAddCustomer() {
    this.dialog
      .open(AddCustomerComponent, {
        width: '100rem',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((refresh: boolean) => {
        if (refresh) this.getCustomers();
      });
  }

  openEditCustomer(_id: string) {
    this.dialog
      .open(EditCustomerComponent, {
        width: '100rem',
        disableClose: true,
        data: {
          _id,
        },
      })
      .afterClosed()
      .subscribe((refresh: boolean) => {
        if (refresh) this.getCustomers();
      });
  }

  getCustomers(isPageEvent = false) {
    this.setQuery(isPageEvent);
    this.customerApi.getCustomers(this.query).subscribe({
      next: (resp) => {
        const response = resp as HttpGetResponse;
        this.customers = response.records as Customer[];
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
    this.getCustomers(true);
  }

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.openAddCustomer();
        return;
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

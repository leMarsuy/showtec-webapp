import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { SOA } from '@app/core/models/soa.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';

@Component({
  selector: 'app-soa-list',
  templateUrl: './soa-list.component.html',
  styleUrl: './soa-list.component.scss',
})
export class SoaListComponent {
  searchForm = new FormGroup({
    searchField: new FormControl(''),
    searchText: new FormControl(''),
  });

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  columns: TableColumn[] = [
    {
      label: 'SOA No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Customer',
      dotNotationPath: '_customerId.name',
      type: ColumnType.STRING,
    },
    {
      label: 'Total',
      dotNotationPath: 'items.length',
      type: ColumnType.STRING,
    },
    {
      label: 'Due Date',
      dotNotationPath: 'dueDate',
      type: ColumnType.DATE,
    },
    {
      label: 'Aging',
      dotNotationPath: 'dueDate',
      type: ColumnType.AGE_IN_DAYS,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STRING,
    },
  ];

  soas!: SOA[];

  constructor(
    private soaApi: SoaApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.getSoas();
  }

  getSoas() {
    this.snackbarService.openLoadingSnackbar('GetData', 'Fetching products...');
    this.soaApi
      .getSoas({
        searchText: this.searchForm.get('searchText')?.value || '',
        // searchField: this.searchForm.get('searchField')?.value || '',
        ...this.page,
      })
      .subscribe({
        next: (resp) => {
          var response = resp as HttpGetResponse;
          this.snackbarService.closeLoadingSnackbar();
          this.soas = response.records as SOA[];
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
    this.getSoas();
  }

  rowEvent(product: SOA) {
    this.router.navigate([product._id], { relativeTo: this.activatedRoute });
  }
}

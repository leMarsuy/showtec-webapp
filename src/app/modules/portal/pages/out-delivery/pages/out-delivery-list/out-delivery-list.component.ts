import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';

@Component({
  selector: 'app-out-delivery-list',
  templateUrl: './out-delivery-list.component.html',
  styleUrl: './out-delivery-list.component.scss',
})
export class OutDeliveryListComponent {
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
      label: 'D/R No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Customer',
      dotNotationPath: '_customerId.name',
      type: ColumnType.STRING,
    },
    {
      label: 'No. of Items',
      dotNotationPath: 'items.length',
      type: ColumnType.STRING,
    },
    {
      label: 'Delivery Date',
      dotNotationPath: 'deliveryDate',
      type: ColumnType.DATE,
    },
    {
      label: 'Aging',
      dotNotationPath: 'deliveryDate',
      type: ColumnType.AGE_IN_DAYS,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STRING,
    },
  ];

  outdeliveries!: OutDelivery[];

  constructor(
    private productApi: OutDeliveryApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.getOutDeliverys();
  }

  getOutDeliverys() {
    this.snackbarService.openLoadingSnackbar('GetData', 'Fetching products...');
    this.productApi
      .getOutDeliverys({
        searchText: this.searchForm.get('searchText')?.value || '',
        // searchField: this.searchForm.get('searchField')?.value || '',
        ...this.page,
      })
      .subscribe({
        next: (resp) => {
          var response = resp as HttpGetResponse;
          this.snackbarService.closeLoadingSnackbar();
          this.outdeliveries = response.records as OutDelivery[];
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
    this.getOutDeliverys();
  }

  rowEvent(product: OutDelivery) {
    this.router.navigate([product._id], { relativeTo: this.activatedRoute });
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
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
      label: 'Due Date',
      dotNotationPath: 'deliveryDate',
      type: ColumnType.AGE_IN_DAYS,
    },

    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'print',
          icon: 'print',
          color: Color.DEAD,
        },
        {
          name: 'edit',
          icon: 'edit',
          color: Color.WARNING,
        },
      ],
    },
  ];

  outdeliveries!: OutDelivery[];

  constructor(
    private outdeliveryApi: OutDeliveryApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.getOutDeliverys();
  }

  getOutDeliverys() {
    this.snackbarService.openLoadingSnackbar(
      'GetData',
      'Fetching Delivery Receipts...'
    );
    this.outdeliveryApi
      .getOutDeliverys({
        searchText: this.searchForm.get('searchText')?.value || '',
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

  actionEvent(e: any) {
    if (e.action.name == 'print') {
      this.print(e.element);
    } else if (e.action.name == 'edit') {
      this.router.navigate(['portal/out-delivery/edit/' + e.element._id]);
    }
  }

  print(outdelivery: OutDelivery) {
    this.snackbarService.openLoadingSnackbar(
      'Loading',
      'Generating PDF. Please wait...'
    );
    if (outdelivery._id)
      this.outdeliveryApi.getPdfOutDelivery(outdelivery._id).subscribe({
        next: (pdf: any) => {
          this.snackbarService._loadingSnackbarRef.dismiss();
          var w = window.open('', '_blank');
          w?.document.write(
            `<iframe width='100%' height='100%' src='${encodeURI(
              pdf.base64
            )}'></iframe>`
          );
        },
      });
  }
}

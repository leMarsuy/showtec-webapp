import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import { OUT_DELIVER_CONFIG } from '../../out-delivery-config';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { filter, switchMap } from 'rxjs';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';

@Component({
  selector: 'app-out-delivery-list',
  templateUrl: './out-delivery-list.component.html',
  styleUrl: './out-delivery-list.component.scss',
})
export class OutDeliveryListComponent {
  searchText = new FormControl('');

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  columns: TableColumn[] = OUT_DELIVER_CONFIG.tableColumns;
  outdeliveries!: OutDelivery[];

  constructor(
    private outdeliveryApi: OutDeliveryApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private confirmationApi: ConfirmationService
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
        searchText: this.searchText.value || '',
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
    const { action } = e.action;
    const outDelivery = e.element;

    switch (action) {
      case 'print':
        this.print(outDelivery);
        break;
      case 'edit':
        this.router.navigate(['portal/out-delivery/edit/' + outDelivery._id]);
        break;
      case 'change-status-cancel':
        this._cancelItem(outDelivery);
        break;
    }
  }

  print(outdelivery: OutDelivery) {
    if (outdelivery._id)
      this.dialog.open(PdfViewerComponent, {
        data: {
          apiCall: this.outdeliveryApi.getPdfOutDelivery(outdelivery._id),
          title: 'View Delivery Receipt',
        },
        maxWidth: '70rem',
        width: '100%',
        disableClose: true,
        autoFocus: false,
      });
  }

  private _cancelItem(outDelivery: OutDelivery) {
    const { cancellationDialog } = OUT_DELIVER_CONFIG;
    const outDeliveryId = outDelivery._id;

    if (!outDeliveryId) {
      throw new Error('Out Delivery Id not found');
    }
    this.confirmationApi
      .open(cancellationDialog.title, cancellationDialog.message)
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          return this.outdeliveryApi.patchOutDeliveryStatus(
            OutDeliveryStatus.CANCELLED,
            outDeliveryId
          );
        })
      )
      .subscribe({
        next: () => {
          this.snackbarService.closeLoadingSnackbar();
        },
        error: (err: HttpErrorResponse) => {
          this.snackbarService.closeLoadingSnackbar().then(() => {
            this.snackbarService.openErrorSnackbar(
              err.error?.errorCode,
              err.error?.message
            );
          });
        },
      });
  }
}

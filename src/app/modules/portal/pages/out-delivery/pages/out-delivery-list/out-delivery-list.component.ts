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
import { filter, switchMap } from 'rxjs';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { generateFileName } from '@app/shared/utils/stringUtil';
import { FileService } from '@app/shared/services/file/file.service';
import { CancelOutDeliveryComponent } from './cancel-out-delivery/cancel-out-delivery.component';
import { OutDeliveryDataService } from '../../out-delivery-data.service';
import { DateFilterType } from '@app/core/enums/date-filter.enum';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-out-delivery-list',
  templateUrl: './out-delivery-list.component.html',
  styleUrl: './out-delivery-list.component.scss',
})
export class OutDeliveryListComponent {
  searchText = new FormControl('');
  placeholder = 'Search DR No | Customer Name | Contact Person';
  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  columns: TableColumn[] = OUT_DELIVER_CONFIG.tableColumns;
  outdeliveries!: OutDelivery[];

  statusControl = new FormControl(OutDeliveryStatus.PENDING);
  tableFilterStatuses = [
    'All',
    OutDeliveryStatus.PENDING,
    OutDeliveryStatus.CANCELLED,
  ];
  selectedFilterStatus: OutDeliveryStatus | string = OutDeliveryStatus.PENDING;

  selectedFilterDate: DateFilterType | { startDate: string; endDate: string } =
    DateFilterType.ALL_TIME;

  isLoading = false;

  query: QueryParams = {
    pageIndex: 0,
    pageSize: 10,
  };

  constructor(
    private outdeliveryApi: OutDeliveryApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private fileApi: FileService,
    private outDeliveryDataService: OutDeliveryDataService
  ) {
    this.getOutDeliverys();
  }

  getOutDeliverys(isPageEvent = false) {
    this.setQuery(isPageEvent);

    const loadingMsg = 'Fetching Delivery Receipts...';
    this._setLoadingState(true, loadingMsg);

    this.outdeliveryApi.getOutDeliverys(this.query).subscribe({
      next: (resp) => {
        const response = resp as HttpGetResponse;
        this._setLoadingState(false);
        this.outdeliveries = response.records as OutDelivery[];
        this.page.length = response.total;
      },
      error: (err: HttpErrorResponse) => {
        this._setLoadingState(false);
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  onFilterStatusChange(event: MatSelectChange) {
    this.selectedFilterStatus = event.value;
    this.getOutDeliverys();
  }

  onFilterDateChange(dateFilter: DateFilterType) {
    this.selectedFilterDate = dateFilter;
    this.getOutDeliverys();
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getOutDeliverys(true);
  }

  actionEvent(e: any) {
    const { action } = e.action;
    const outDelivery = e.element;

    switch (action) {
      case 'print':
        this._print(outDelivery);
        break;
      case 'edit':
        this.router.navigate([
          'portal',
          'out-delivery',
          'edit',
          outDelivery._id,
        ]);
        break;
      case 'change-status-cancel':
        this._cancelItem(outDelivery);
        break;
      case 'clone':
        this.outDeliveryDataService.setOutDelivery(outDelivery);
        this.router.navigate(['portal', 'out-delivery', 'create']);
        break;
    }
  }

  private setQuery(isPageEvent = false) {
    const status =
      this.selectedFilterStatus === 'All' ? '' : this.selectedFilterStatus;

    const date =
      this.selectedFilterDate === DateFilterType.ALL_TIME
        ? ''
        : this.selectedFilterDate;

    const pageIndex = isPageEvent ? this.page.pageIndex : 0;
    const searchText = this.searchText.value ?? '';

    this.query = {
      searchText,
      status,
      date,
      pageIndex,
      pageSize: this.page.pageSize,
    };
  }

  private _print(outdelivery: OutDelivery) {
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

  exportTableExcel() {
    const query: QueryParams = {
      searchText: this.query.searchText,
      status: this.query.status,
      date: this.query.date,
    };
    this._setLoadingState(true, 'Downloading Excel');

    this.outdeliveryApi.exportOutDeliveries(query).subscribe({
      next: (response: any) => {
        this._setLoadingState(false);
        const fileName = generateFileName('OUT_DELIVERIES', 'xlsx');
        this.fileApi.downloadFile(response.body as Blob, fileName);
      },
      error: ({ error }: HttpErrorResponse) => {
        this._setLoadingState(false);
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }

  private _cancelItem(outDelivery: OutDelivery) {
    const outDeliveryId = outDelivery._id;

    if (!outDeliveryId) {
      console.error('Out Delivery Item has no ID');
      return;
    }

    this.dialog
      .open(CancelOutDeliveryComponent, {
        data: outDelivery,
        disableClose: true,
        autoFocus: false,
        width: '55%',
      })
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this._setLoadingState(true, 'Cancelling Delivery');
          return this.outdeliveryApi.cancelOutDeliveryById(outDeliveryId);
        })
      )
      .subscribe({
        next: () => {
          this._setLoadingState(false);
          this.snackbarService.openSuccessSnackbar(
            'Success',
            'Delivery has been cancelled.'
          );
          setTimeout(() => {
            this.getOutDeliverys();
          }, 800);
        },
        error: ({ error }: HttpErrorResponse) => {
          this._setLoadingState(false);
          console.error(error);
          this.snackbarService.openErrorSnackbar(
            error.errorCode,
            error.message
          );
        },
      });
  }

  private _setLoadingState(isLoading: boolean, loadingMessage = '') {
    this.isLoading = isLoading;

    if (isLoading) {
      this.snackbarService.openLoadingSnackbar('Please Wait', loadingMessage);
    } else {
      this.snackbarService.closeLoadingSnackbar();
    }
  }
}

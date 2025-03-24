import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSelectChange } from '@angular/material/select';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { DateFilterType } from '@app/core/enums/date-filter.enum';
import { SoaStatus } from '@app/core/enums/soa-status.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { SOA } from '@app/core/models/soa.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { FileService } from '@app/shared/services/file/file.service';
import { generateFileName } from '@app/shared/utils/stringUtil';
import { finalize, Observable, Subject } from 'rxjs';
import { SOA_CONFIG } from '../../soa-config';
import { SoaDataService } from '../../soa-data.service';
import { ViewSoaComponent } from '../view-soa/view-soa.component';

@Component({
  selector: 'app-soa-list',
  templateUrl: './soa-list.component.html',
  styleUrl: './soa-list.component.scss',
})
export class SoaListComponent implements OnDestroy {
  searchText = new FormControl('');
  placeholder = 'Search SOA No. | Contact Person';

  soas!: any;
  tableResponse$ = new Observable<any>();
  columns: TableColumn[] = SOA_CONFIG.tableColumns;

  statusControl = new FormControl('All');
  poFilterControl = new FormControl('All');
  tableFilterStatuses = SOA_CONFIG.tableFilters.statuses;
  selectedFilterStatus: SoaStatus | string = 'All';
  selectedFilterDate = DateFilterType.ALL_TIME;
  poFilter = ['All', 'With PO', 'Without PO'];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  query: QueryParams = {
    pageIndex: 0,
    pageSize: 10,
  };

  downloading = false;
  private destroyed$ = new Subject<void>();
  constructor(
    private soaApi: SoaApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private fileApi: FileService,
    private soaData: SoaDataService,
  ) {
    this.getSoas();
  }

  search() {
    this.query.searchText = this.searchText.value ?? '';
    this.query.pageIndex = 0;

    this.getSoas();
  }

  pageEvent(e: PageEvent) {
    const pageIndex = e.pageIndex || 0;
    const pageSize = e.pageSize || 10;
    this.page.pageSize = pageSize;
    this.page.pageIndex = pageIndex;

    this.query = {
      ...this.query,
      pageIndex,
      pageSize,
    };

    this.getSoas();
  }

  onFilterPOChange(event: MatSelectChange) {
    const poFilter = event.value === 'All' ? '' : event.value;
    this.query['poFilter'] = poFilter;
    this.query.pageIndex = 0;
    this.getSoas();
  }

  onFilterStatusChange(event: MatSelectChange) {
    const status = event.value === 'All' ? '' : event.value;
    this.query['status'] = status;
    this.query.pageIndex = 0;
    this.getSoas();
  }

  onFilterDateChange(dateFilter: any) {
    const date = dateFilter === DateFilterType.ALL_TIME ? '' : dateFilter;
    this.query['date'] = date;
    this.query.pageIndex = 0;
    this.getSoas();
  }

  getSoas() {
    this.snackbarService.openLoadingSnackbar('Fetching SOAS', 'Please Wait...');
    this.soaApi
      .getSoas(this.query)
      .pipe(
        finalize(() => {
          this.snackbarService.closeLoadingSnackbar();
        }),
      )
      .subscribe({
        next: (resp) => {
          const response = resp as HttpGetResponse;
          this.soas = response.records as SOA[];
          this.page.length = response.total;
        },
        error: ({ error }: HttpErrorResponse) => {
          this.snackbarService.openErrorSnackbar(
            error.errorCode,
            error.message,
          );
          this.page.length = 0;
        },
      });
  }

  actionEvent(e: any) {
    const { action } = e.action;
    const soa = e.element;

    switch (action) {
      case 'print':
        this.print(soa);
        break;

      case 'edit':
        this.router.navigate([PORTAL_PATHS.soas.editUrl, soa._id]);
        break;

      case 'payments':
        this._onClickPayment(soa);
        break;

      case 'clone':
        this.soaData.setSoa(soa);
        this.router.navigate([PORTAL_PATHS.soas.createUrl]);
        break;
    }
  }

  print(soa: SOA) {
    if (!soa._id) return;
    this.dialog.open(PdfViewerComponent, {
      data: {
        apiCall: this.soaApi.getPdfSoa(soa._id),
        title: 'View Statement of Account',
      },
      maxWidth: '70rem',
      width: '100%',
      disableClose: true,
      autoFocus: false,
    });
  }

  exportTableExcel() {
    const loadingMsg = 'Downloading Excel file...';
    this._setDownloadingState(true, loadingMsg);

    const query: QueryParams = {
      searchText: this.query.searchText,
      status: this.query.status,
      date: this.query.date,
    };

    this.soaApi.exportExcelSoas(query).subscribe({
      next: (response: any) => {
        this._setDownloadingState(false);
        const fileName = generateFileName('SOA', 'xlsx');
        this.fileApi.downloadFile(response.body as Blob, fileName);
      },
      error: ({ error }: HttpErrorResponse) => {
        this._setDownloadingState(false);
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
      complete: () => {
        this.downloading = false;
      },
    });
  }

  private _onClickPayment(soa: SOA) {
    this.dialog
      .open(ViewSoaComponent, {
        width: '100rem',
        maxWidth: '100rem',
        disableClose: true,
        data: {
          _id: soa._id,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getSoas();
      });
  }

  private _setDownloadingState(isDownloading: boolean, loadingMsg = '') {
    this.downloading = isDownloading;

    if (isDownloading) {
      this.snackbarService.openLoadingSnackbar('Please Wait', loadingMsg);
    } else {
      this.snackbarService.closeLoadingSnackbar();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

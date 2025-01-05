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
  tableFilterStatuses = SOA_CONFIG.tableFilters.statuses;
  selectedFilterStatus: SoaStatus | string = 'All';
  selectedFilterDate = DateFilterType.THIS_YEAR;

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

  getSoas(isPageEvent = false) {
    this.setQuery(isPageEvent);

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
      });
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

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this.getSoas(true);
  }

  actionEvent(e: any) {
    // const action => contains table column action data
    // const element => contains table row data

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

  onFilterStatusChange(event: MatSelectChange) {
    this.selectedFilterStatus = event.value;
    this.getSoas();
  }

  onFilterDateChange(dateFilter: any) {
    this.selectedFilterDate = dateFilter;
    this.getSoas();
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

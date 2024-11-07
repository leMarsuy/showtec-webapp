import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { SOA } from '@app/core/models/soa.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { ViewSoaComponent } from '../view-soa/view-soa.component';
import { SOA_CONFIG } from '../../soa-config';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { generateFileName } from '@app/shared/utils/stringUtil';
import { SoaStatus } from '@app/core/enums/soa-status.enum';
import { FileService } from '@app/shared/services/file/file.service';
import { SoaDataService } from '../../soa-data.service';

@Component({
  selector: 'app-soa-list',
  templateUrl: './soa-list.component.html',
  styleUrl: './soa-list.component.scss',
})
export class SoaListComponent {
  searchText = new FormControl('');
  placeholder = 'Search SOA No. | Contact Person';
  downloading = false;

  soas!: SOA[];
  columns: TableColumn[] = SOA_CONFIG.tableColumns;
  tableFilterStatuses = SOA_CONFIG.tableFilters.statuses;
  tableFilterStatus: SoaStatus | string = 'All';

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  constructor(
    private soaApi: SoaApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private fileApi: FileService,
    private soaData: SoaDataService
  ) {
    this.getSoas();
  }

  getSoas() {
    this.snackbarService.openLoadingSnackbar('GetData', 'Fetching SOAs...');
    this.soaApi
      .getSoas(
        {
          searchText: this.searchText.value || '',
          ...this.page,
        },
        this.tableFilterStatus
      )
      .subscribe({
        next: (resp) => {
          const response = resp as HttpGetResponse;
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

  actionEvent(e: any) {
    // const action => contains table column action data
    // const element => contains table row data

    const { action, element } = e;

    switch (action.action) {
      case 'print':
        this.print(element);
        break;

      case 'edit':
        this.router.navigate(['portal/soa/edit/' + element._id]);
        break;

      case 'payments':
        this._onClickPayment(element);
        break;

      case 'clone':
        this.soaData.setSoa(e.element);
        this.router.navigate(['portal', 'soa', 'create']);
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

  onFilterStatusChange(status: SoaStatus | string) {
    this.tableFilterStatus = status;
    this.getSoas();
  }

  exportTableExcel() {
    this.snackbarService.openLoadingSnackbar(
      'Please Wait',
      'Downloading Excel file...'
    );
    this.downloading = true;
    const query: QueryParams = {
      searchText: this.searchText.value || '',
    };

    this.soaApi.exportExcelSoas(query).subscribe({
      next: (response: any) => {
        this.downloading = false;
        this.snackbarService.closeLoadingSnackbar();
        const fileName = generateFileName('SOA', 'xlsx');
        this.fileApi.downloadFile(response.body as Blob, fileName);
      },
      error: ({ error }: HttpErrorResponse) => {
        this.downloading = false;
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
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { SoaStatus } from '@app/core/enums/soa-status.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { SOA } from '@app/core/models/soa.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { ViewSoaComponent } from '../view-soa/view-soa.component';
import {
  MONITOR_STATUSES,
  MonitorStatus,
} from '@app/core/enums/monitor-status.enum';

@Component({
  selector: 'app-soa-list',
  templateUrl: './soa-list.component.html',
  styleUrl: './soa-list.component.scss',
})
export class SoaListComponent {
  monitorStatuses = MONITOR_STATUSES;

  monitorStatus = 'All';

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
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          value: SoaStatus.PENDING,
          color: Color.DEAD,
        },
        {
          value: SoaStatus.PAID,
          color: Color.SUCCESS,
        },
        {
          value: SoaStatus.PARTIAL,
          color: Color.WARNING,
        },
        {
          value: SoaStatus.CANCELLED,
          color: Color.ERROR,
        },
      ],
    },
    {
      label: 'Total',
      dotNotationPath: 'summary.grandtotal',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Paid',
      dotNotationPath: 'payment.paid',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Date of SOA',
      dotNotationPath: 'soaDate',
      type: ColumnType.DATE,
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
        {
          name: 'payments',
          icon: 'money',
          color: Color.SUCCESS,
        },
      ],
    },
  ];

  soas!: SOA[];

  constructor(
    private soaApi: SoaApiService,
    private snackbarService: SnackbarService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.getSoas();
  }

  clearForm() {
    this.searchForm.reset();
    this.searchForm.markAsUntouched();
    this.getSoas();
  }

  getSoas() {
    this.snackbarService.openLoadingSnackbar('GetData', 'Fetching SOAs...');
    this.soaApi
      .getSoas(
        {
          searchText: this.searchForm.get('searchText')?.value || '',
          ...this.page,
        },
        this.monitorStatus
      )
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

  actionEvent(e: any) {
    if (e.action.name == 'print') {
      this.print(e.element);
    } else if (e.action.name == 'edit') {
      this.router.navigate(['portal/soa/edit/' + e.element._id]);
    } else if (e.action.name == 'payments') {
      this.dialog
        .open(ViewSoaComponent, {
          width: '100rem',
          maxWidth: '100rem',
          disableClose: true,
          data: {
            _id: e.element._id,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res) this.getSoas();
        });
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

  // _selectedCss(status: MonitorStatus) {
  //   var color = Color.DEAD

  //   return "py-2 px-4 border-2 border-{{
  //         monitorStatus === item ? 'emerald' : 'gray'
  //       }}-400  cursor-pointer rounded-3xl"
  // }
}

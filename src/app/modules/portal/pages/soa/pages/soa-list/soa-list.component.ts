import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { HttpGetResponse } from '@app/core/interfaces/http-get-response.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { SOA } from '@app/core/models/soa.model';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
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
      dotNotationPath: 'summary.grandtotal',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Date of SOA',
      dotNotationPath: 'soaDate',
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

  actionEvent(e: any) {
    if (e.action.name == 'print') {
      this.print(e.element);
    } else if (e.action.name == 'edit') {
      this.router.navigate(['portal/soa/edit/' + e.element._id]);
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
}

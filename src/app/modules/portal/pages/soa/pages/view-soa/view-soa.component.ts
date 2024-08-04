import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { PaymentMethod } from '@app/core/enums/payment-method.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { SOA, Transaction } from '@app/core/models/soa.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { Color } from '@app/core/enums/color.enum';
import { SoaStatus } from '@app/core/enums/soa-status.enum';
import { Status } from '@app/core/enums/status.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { Alignment } from '@app/core/enums/align.enum';

@Component({
  selector: 'app-view-soa',
  templateUrl: './view-soa.component.html',
  styleUrl: './view-soa.component.scss',
})
export class ViewSoaComponent {
  soa!: SOA;
  productTotal = 0;
  productDiscount = 0;
  codeStatus = Color.DEAD;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { _id: string },
    private soaApi: SoaApiService,
    private sb: SnackbarService,
    private dialog: MatDialog,
    private confirmation: ConfirmationService
  ) {
    this.getProductById();
  }

  page: PageEvent = {
    length: 1,
    pageIndex: 0,
    pageSize: 10,
  };

  columns: TableColumn[] = [
    {
      label: 'Payment Method',
      dotNotationPath: 'paymentMethod',
      type: ColumnType.STRING,
    },
    {
      label: 'Amount',
      dotNotationPath: 'amount',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Date',
      dotNotationPath: 'paymentDate',
      type: ColumnType.DATE,
    },
    {
      label: 'Remarks',
      dotNotationPath: 'remarks',
      type: ColumnType.STRING,
    },
    {
      label: 'Recorded By',
      dotNotationPath: 'recordedBy.name',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          value: Status.ACTIVE,
          color: Color.SUCCESS,
        },
        {
          value: Status.DELETED,
          color: Color.ERROR,
        },
      ],
    },

    {
      label: '#',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'remove',
          icon: 'remove',
          color: Color.ERROR,
        },
      ],
    },
  ];

  actionEvent(e: any) {
    if (e.action.name == 'remove') {
      this.confirmation
        .open(
          'Ooops',
          'You will be <span class="text-rose-500">DELETING</span> a payment transaction. Are you sure?'
        )
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.soaApi.deletePayment(e.element._id).subscribe({
              next: (response) => {
                console.log(response);
                this.getProductById();
              },
              error: (err: HttpErrorResponse) => {
                this.sb.openErrorSnackbar(
                  err.error.errorCode,
                  err.error.message
                );
              },
            });
          }
        });
    }
  }

  getProductById() {
    this.soaApi.getSoaById(this.data._id).subscribe({
      next: (response) => {
        this.soa = response as SOA;
        for (let item of this.soa.items) {
          this.productTotal += item.STATIC.unit_price * item.STATIC.quantity;

          this.productDiscount +=
            item.STATIC.disc * item.STATIC.unit_price * item.STATIC.quantity;

          switch (this.soa.status) {
            case SoaStatus.PAID:
              this.codeStatus = Color.SUCCESS;
              break;
            case SoaStatus.CANCELLED:
              this.codeStatus = Color.ERROR;
              break;
            case SoaStatus.PENDING:
              this.codeStatus = Color.WARNING;
              break;
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.sb.openErrorSnackbar(err.error.errorCode, err.error.message);
      },
    });
  }

  addPayment() {
    this.dialog
      .open(AddPaymentComponent, {
        width: '40rem',
        data: {
          _id: this.data._id,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getProductById();
      });
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { PaymentStatus } from '@app/core/enums/payment-status.enum';
import { SoaStatus } from '@app/core/enums/soa-status.enum';
import { SOA } from '@app/core/models/soa.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { UpdatePaymentComponent } from '../update-payment/update-payment.component';

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
  displayedColumns: string[] = [
    'amount',
    'method',
    'bank',
    'paymentDate',
    'depositedDate',
    'status',
    'remarks',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { _id: string },
    private soaApi: SoaApiService,
    private sb: SnackbarService,
    private dialog: MatDialog,
    private confirmation: ConfirmationService,
  ) {
    this.getProductById();
  }

  page: PageEvent = {
    length: 1,
    pageIndex: 0,
    pageSize: 10,
  };

  onUpdatePayment(transaction: any) {
    this.dialog
      .open(UpdatePaymentComponent, {
        width: '40rem',
        data: transaction,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getProductById();
      });
  }

  _cssStatus(status: PaymentStatus) {
    var color: Color = Color.DEAD;
    switch (status) {
      case PaymentStatus.COMPLETED:
        color = Color.SUCCESS;
        break;

      case PaymentStatus.PENDING:
        color = Color.INFO;
        break;

      case PaymentStatus.FAILED:
        color = Color.ERROR;
        break;

      default:
        break;
    }

    return `w-fit px-4 border-2 border-${color}-500 text-${color}-500 bg-${color}-100 text-center rounded-xl cursor-pointer hover:bg-${color}-200`;
  }

  getProductById() {
    this.soaApi.getSoaById(this.data._id).subscribe({
      next: (response) => {
        this.soa = response as SOA;
        this._calculateTotals();
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
          balance: this.soa.payment?.balance,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getProductById();
      });
  }

  private _calculateTotals() {
    this.productTotal = 0;
    this.productDiscount = 0;

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

    if (!this.soa?.payment) {
      this.soa.payment = {
        paid: 0,
        balance: this.soa.summary?.grandtotal || 0,
      };
    }
  }
}

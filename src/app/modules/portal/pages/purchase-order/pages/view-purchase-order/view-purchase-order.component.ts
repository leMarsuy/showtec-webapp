import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { PaymentStatus } from '@app/core/enums/payment-status.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { PurchaseOrderStatus } from '@app/core/enums/purchase-order.enum';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';
import { AddPaymentComponent } from './components/add-payment/add-payment.component';
import { UpdatePaymentComponent } from './components/update-payment/update-payment.component';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html',
  styleUrl: './view-purchase-order.component.scss',
})
export class ViewPurchaseOrderComponent {
  purchaseOrder!: PurchaseOrder;
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

  hasUpdate = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { _id: string },
    private poApi: PurchaseOrderApiService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<ViewPurchaseOrderComponent>
  ) {
    this._getPurchaseOrderById(this.data as any);
  }

  page: PageEvent = {
    length: 1,
    pageIndex: 0,
    pageSize: 10,
  };

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

    return `w-fit px-4 border-2 border-${color}-500 text-${color}-500 bg-${color}-100 text-center rounded-xl`;
  }

  private _calculateTotals() {
    this.productTotal = 0;
    this.productDiscount = 0;

    for (let item of this.purchaseOrder.items) {
      this.productTotal += item.STATIC.unit_price * item.STATIC.quantity;
      this.productDiscount +=
        item.STATIC.disc * item.STATIC.unit_price * item.STATIC.quantity;
      switch (this.purchaseOrder.status) {
        case PurchaseOrderStatus.PAID:
          this.codeStatus = Color.SUCCESS;
          break;
        case PurchaseOrderStatus.CANCELLED:
          this.codeStatus = Color.ERROR;
          break;
        case PurchaseOrderStatus.PENDING:
          this.codeStatus = Color.WARNING;
          break;
      }
    }

    if (!this.purchaseOrder?.payment) {
      this.purchaseOrder.payment = {
        paid: 0,
        balance: this.purchaseOrder.summary?.grandtotal || 0,
      };
    }
  }

  onUpdatePayment(transaction: any) {
    this.dialog
      .open(UpdatePaymentComponent, {
        width: '40rem',
        data: transaction,
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((res) => {
        if (!res) return;

        this._getPurchaseOrderById(this.data as any);
        this.hasUpdate = true;
      });
  }

  onAddPayment() {
    this.dialog
      .open(AddPaymentComponent, {
        width: '40rem',
        disableClose: true,
        autoFocus: false,
        data: {
          _id: this.data,
          balance: this.purchaseOrder.payment?.balance,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (!res) return;

        this.hasUpdate = true;
        this._getPurchaseOrderById(this.data as any);
      });
  }

  onDialogClose() {
    this.dialogRef.close(this.hasUpdate);
  }

  private _getPurchaseOrderById(id: string) {
    this.poApi.getPurchaseOrderById(id).subscribe({
      next: (response) => {
        this.purchaseOrder = response as PurchaseOrder;
        this._calculateTotals();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackbar.openErrorSnackbar(err.error.errorCode, err.error.message);
      },
    });
  }
}

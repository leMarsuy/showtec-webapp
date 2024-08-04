import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PAYMENT_METHODS,
  PaymentMethod,
} from '@app/core/enums/payment-method.enum';
import { Transaction } from '@app/core/models/soa.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.scss',
})
export class AddPaymentComponent {
  paymentMethods = PAYMENT_METHODS;
  submitting = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { _id: string },
    private soaApi: SoaApiService,
    private sb: SnackbarService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPaymentComponent>
  ) {}

  transactionForm = this.fb.group({
    paymentMethod: [PaymentMethod.CASH, Validators.required],
    amount: [0, [Validators.required, Validators.min(0)]],
    paymentDate: [new Date(), Validators.required],
    remarks: [''],
  });

  submit() {
    this.submitting = true;
    var transaction: Transaction =
      this.transactionForm.getRawValue() as Transaction;
    this.soaApi.createPayment(this.data._id, transaction).subscribe({
      next: (response) => {
        this.submitting = false;
        this.sb.openSuccessSnackbar(
          'Payment Success',
          'Payment successfully added to this SOA.'
        );
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.sb.openErrorSnackbar(err.error.errorCode, err.error.message);
      },
    });
  }
}

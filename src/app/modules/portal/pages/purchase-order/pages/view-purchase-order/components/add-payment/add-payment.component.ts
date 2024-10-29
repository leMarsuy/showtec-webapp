import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PAYMENT_METHODS,
  PaymentMethod,
} from '@app/core/enums/payment-method.enum';
import { REGISTERED_BANKS } from '@app/core/enums/registered-bank.enum';
import { Transaction } from '@app/core/models/soa.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AddPaymentComponent {
  paymentMethods = PAYMENT_METHODS;
  submitting = false;
  registeredBanks = REGISTERED_BANKS;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { _id: string; balance: number },
    private poApi: PurchaseOrderApiService,
    private sb: SnackbarService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPaymentComponent>
  ) {
    this.onTransactionFormChange();
  }

  transactionForm = this.fb.group({
    paymentMethod: [PaymentMethod.CASH, Validators.required],
    amount: [this.data.balance || 0, [Validators.required, Validators.min(0)]],
    paymentDate: [new Date(), Validators.required],
    remarks: [''],
    // both
    bank: [''],
    // bt
    referenceNo: [''],
    // check
    issuingBank: [''],
    checkNo: [''],
    accountName: [''],
    accountNo: [''],
    // optional
    depositedDate: [new Date(), Validators.required],
  });

  onTransactionFormChange() {
    this.transactionForm
      .get('paymentMethod')
      ?.valueChanges.subscribe((paymentMethod) => {
        var tform = this.transactionForm;

        tform.get('bank')?.clearValidators();
        tform.get('referenceNo')?.clearValidators();
        tform.get('issuingBank')?.clearValidators();
        tform.get('checkNo')?.clearValidators();
        tform.get('depositedDate')?.setValidators(Validators.required);

        switch (paymentMethod) {
          case PaymentMethod.CASH:
            tform.get('depositedDate')?.setValue(new Date());
            break;

          case PaymentMethod.BANK_TRANSFER:
            tform.get('bank')?.setValidators(Validators.required);
            tform.get('referenceNo')?.setValidators(Validators.required);
            break;

          case PaymentMethod.CHECK:
            tform.get('depositedDate')?.setValue(null);
            tform.get('depositedDate')?.clearValidators();
            tform.get('issuingBank')?.setValidators(Validators.required);
            tform.get('checkNo')?.setValidators(Validators.required);
            break;

          default:
            break;
        }

        tform.get('bank')?.updateValueAndValidity();
        tform.get('referenceNo')?.updateValueAndValidity();
        tform.get('issuingBank')?.updateValueAndValidity();
        tform.get('checkNo')?.updateValueAndValidity();
      });
  }

  submit() {
    this.submitting = true;
    var transaction: Transaction =
      this.transactionForm.getRawValue() as Transaction;
    this.poApi.createPayment(this.data._id, transaction).subscribe({
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

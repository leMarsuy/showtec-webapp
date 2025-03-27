import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
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
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './add-payment.component.scss',
})
export class AddPaymentComponent implements OnDestroy {
  paymentMethods = PAYMENT_METHODS;
  submitting = false;
  registeredBanks = REGISTERED_BANKS;

  private _destroyed = new Subject<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { _id: string; balance: number },
    private soaApi: SoaApiService,
    private sb: SnackbarService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPaymentComponent>,
  ) {
    this.onTransactionFormChange();
    this.onBankChange();
  }

  transactionForm = this.fb.group({
    paymentMethod: [PaymentMethod.CASH, Validators.required],
    amount: [this.data.balance ?? 0, [Validators.required, Validators.min(0)]],
    paymentDate: [new Date(), Validators.required],
    remarks: [''],
    // both
    bank: [''],
    specificBank: [''],
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
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe((paymentMethod) => {
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

  onBankChange() {
    this.transactionForm
      .get('bank')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe((bank) => {
        console.log(bank);
        if (bank === 'OTHERS') {
          this.transactionForm
            .get('specificBank')
            ?.setValidators(Validators.required);
        } else {
          this.transactionForm.get('specificBank')?.setValue('');
          this.transactionForm.get('specificBank')?.clearValidators();
        }
      });
  }

  submit() {
    this.submitting = true;
    var transaction: Transaction =
      this.transactionForm.getRawValue() as Transaction;
    this.soaApi.createPayment(this.data._id, transaction).subscribe({
      next: (response) => {
        this.submitting = false;
        this.sb.openSuccessSnackbar(
          'Payment Success',
          'Payment successfully added to this SOA.',
        );
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.sb.openErrorSnackbar(err.error.errorCode, err.error.message);
      },
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}

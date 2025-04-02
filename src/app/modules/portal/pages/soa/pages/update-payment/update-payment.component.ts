import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentMethod } from '@app/core/enums/payment-method.enum';
import {
  PAYMENT_STATUSES,
  PaymentStatus,
} from '@app/core/enums/payment-status.enum';
import {
  REGISTERED_BANKS,
  RegisteredBank,
} from '@app/core/enums/registered-bank.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './update-payment.component.scss',
})
export class UpdatePaymentComponent implements OnDestroy {
  paymentStatuses = PAYMENT_STATUSES;
  submitting = false;
  registeredBanks = REGISTERED_BANKS;

  transactionForm = this.fb.group({
    status: ['', Validators.required],
    remarks: [''],
    bank: [''],
    specificBank: [''],
    depositedDate: [null],
  });

  private _destroyed$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmation: ConfirmationService,
    private soaApi: SoaApiService,
    private sb: SnackbarService,
    private dialogRef: MatDialogRef<UpdatePaymentComponent>,
  ) {
    this.transactionForm.get('status')?.setValue(this.data.status);
    this.transactionForm.get('bank')?.setValue(this.data.bank);
    this.transactionForm.get('specificBank')?.setValue(this.data.specificBank);
    this.transactionForm
      .get('depositedDate')
      ?.setValue(this.data.depositedDate);
    this.transactionForm.get('remarks')?.setValue(this.data.remarks);

    this.onTransactionFormChange();
    this.onBankChange();
  }

  onTransactionFormChange() {
    this.transactionForm
      .get('status')
      ?.valueChanges.pipe(takeUntil(this._destroyed$))
      .subscribe((status) => {
        var tform = this.transactionForm;

        switch (status) {
          case PaymentStatus.COMPLETED:
            if (this.data.paymentMethod === PaymentMethod.CHECK) {
              tform.get('depositedDate')?.setValidators(Validators.required);
              tform.get('bank')?.setValidators(Validators.required);
            } else if (
              this.data.paymentMethod === PaymentMethod.BANK_TRANSFER
            ) {
              tform.get('depositedDate')?.clearValidators();
              tform.get('depositedDate')?.setValue(null);
              tform.get('bank')?.setValidators(Validators.required);
            }
            break;

          case PaymentStatus.CANCELED:

          default:
            tform.get('depositedDate')?.clearValidators();
            tform.get('depositedDate')?.setValue(null);
            tform.get('bank')?.clearValidators();
            tform.get('bank')?.setValue(null);
            break;
        }

        tform.get('depositedDate')?.updateValueAndValidity();
        tform.get('bank')?.updateValueAndValidity();
      });
  }

  onBankChange() {
    this.transactionForm
      .get('bank')
      ?.valueChanges.pipe(takeUntil(this._destroyed$))
      .subscribe((bank) => {
        if (bank === RegisteredBank.OTHERS) {
          this.transactionForm
            .get('specificBank')
            ?.setValidators(Validators.required);
        } else {
          this.transactionForm.get('specificBank')?.setValue('');
          this.transactionForm.get('specificBank')?.clearValidators();
        }
        this.transactionForm.get('specificBank')?.updateValueAndValidity();
      });
  }

  submit() {
    this.confirmation
      .open(
        'Mark as ' + this.transactionForm.value.status + ' Payment?',
        'Would you like to confirm this action?',
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.sb.openLoadingSnackbar(
            'Loading',
            'Updating Payment Transaction...',
          );
          var body = this.transactionForm.getRawValue();
          this.soaApi.updatePayment(this.data._id, body).subscribe({
            next: (response) => {
              this.sb.closeLoadingSnackbar();
              this.sb.openSuccessSnackbar(
                'Payment Updated',
                'Update of Payment Transaction is Successful',
              );
              this.dialogRef.close(true);
            },
            error: (err: HttpErrorResponse) => {
              this.sb.closeLoadingSnackbar();
              this.sb.openErrorSnackbar(err.error.errorCode, err.error.message);
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

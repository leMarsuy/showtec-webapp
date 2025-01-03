import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PAYMENT_STATUSES,
  PaymentStatus,
} from '@app/core/enums/payment-status.enum';
import { REGISTERED_BANKS } from '@app/core/enums/registered-bank.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.component.html',
  styleUrl: './update-payment.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class UpdatePaymentComponent {
  paymentStatuses = PAYMENT_STATUSES;
  submitting = false;
  registeredBanks = REGISTERED_BANKS;

  transactionForm = this.fb.group({
    status: ['', Validators.required],
    remarks: [''],
    bank: [''],
    depositedDate: [null],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmation: ConfirmationService,
    private poApi: PurchaseOrderApiService,
    private sb: SnackbarService,
    private dialogRef: MatDialogRef<UpdatePaymentComponent>,
  ) {
    this.transactionForm.get('status')?.setValue(this.data.status);
    this.transactionForm.get('bank')?.setValue(this.data.bank);
    this.transactionForm.get('remarks')?.setValue(this.data.remarks);
    this.onTransactionFormChange();
  }

  onTransactionFormChange() {
    this.transactionForm.get('status')?.valueChanges.subscribe((status) => {
      const tform = this.transactionForm;

      switch (status) {
        case PaymentStatus.COMPLETED:
          if (['Bank Transfer', 'Check'].includes(this.data.paymentMethod)) {
            tform.get('depositedDate')?.setValidators(Validators.required);
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

  submit() {
    this.confirmation
      .open(
        'Mark as ' + this.transactionForm.value.status + ' Payment?',
        'Would you like to confirm this action?',
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          var body = this.transactionForm.getRawValue();
          this.poApi.updatePayment(this.data._id, body).subscribe({
            next: (response) => {
              this.sb.openSuccessSnackbar(
                'PaymentUpdate',
                'Update of Payment Transaction is Successful',
              );
              this.dialogRef.close(true);
            },
            error: (err: HttpErrorResponse) => {
              this.sb.openErrorSnackbar(err.error.errorCode, err.error.message);
            },
          });
        }
      });
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VOUCHER_STATUSES } from '@app/core/enums/voucher-status.enum';
import { Voucher } from '@app/core/models/voucher.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { VoucherApiService } from '@app/shared/services/api/voucher-api/voucher-api.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-change-status-modal',
  templateUrl: './change-status-modal.component.html',
  styleUrl: './change-status-modal.component.scss',
})
export class ChangeStatusModalComponent {
  voucherStatuses = VOUCHER_STATUSES;

  statusControl!: FormControl;
  isSubmitting = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Voucher,
    private _dialogRef: MatDialogRef<ChangeStatusModalComponent>,
    private voucherApi: VoucherApiService,
    private formBuilder: FormBuilder,
    private confirmation: ConfirmationService,
    private snackbar: SnackbarService
  ) {
    const voucherStatus = this.data.status;

    this.statusControl = this.formBuilder.control(
      voucherStatus,
      Validators.required
    );
  }

  onClose(hasUpdate = false) {
    this._dialogRef.close(hasUpdate);
  }

  onSubmit() {
    const voucherId = this.data._id;
    const voucherNo = this.data.code?.value;

    if (!voucherId) {
      console.error('Error 404: Missing Voucher ID');
      return;
    }

    const voucherStatus = this.data.status;
    const selectedStatus = this.statusControl.value;

    const confirmationMsg = `Do you want to update Voucher #${voucherNo} status from <b>${voucherStatus}</b> to <b>${selectedStatus}</b>`;
    this.confirmation
      .open('Confirmation', confirmationMsg)
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this._setSubmittingState(true);
          return this.voucherApi.patchVoucherStatusById(
            voucherId,
            selectedStatus
          );
        })
      )
      .subscribe({
        next: () => {
          this.snackbar.openSuccessSnackbar(
            'Success',
            'Voucher status has been successfully updated!'
          );

          setTimeout(() => {
            this._setSubmittingState(false);
            this.onClose(true);
          }, 800);
        },
        error: ({ error }: HttpErrorResponse) => {
          this._setSubmittingState(false);
          console.log(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  private _setSubmittingState(isSubmitting: boolean) {
    this.isSubmitting = isSubmitting;

    if (isSubmitting) {
      this.snackbar.openLoadingSnackbar('Please Wait', 'Submitting changes...');
    } else {
      this.snackbar.closeLoadingSnackbar();
    }
  }
}

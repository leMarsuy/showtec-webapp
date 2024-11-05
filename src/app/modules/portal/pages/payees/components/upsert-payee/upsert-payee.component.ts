import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Payee } from '@app/core/models/payee.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { PayeeApiService } from '@app/shared/services/api/payee-api/payee-api.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-upsert-payee',
  templateUrl: './upsert-payee.component.html',
  styleUrl: './upsert-payee.component.scss',
})
export class UpsertPayeeComponent {
  title: string;
  submitLabel: string;

  payeeForm!: FormGroup;
  isLoading = false;
  isUpdate = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<UpsertPayeeComponent>,
    private readonly payeeApi: PayeeApiService,
    private readonly snackbar: SnackbarService,
    private readonly confirmation: ConfirmationService
  ) {
    this.payeeForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    if (this.data) {
      this._patchFormValues(this.data);
    }

    this.isUpdate = !!this.data;
    this.title = this.isUpdate ? 'Update Payee' : 'Add Payee';
    this.submitLabel = this.isUpdate ? 'Update Payee' : 'Add Payee';
  }

  onSubmit() {
    const snackbarMsg = this.isUpdate ? 'Updating Payee' : 'Adding Payee';
    const confirmationMsg = this.isUpdate ? 'update' : 'add';

    this.confirmation
      .open(
        'Payee Confirmation',
        `Do you want to ${confirmationMsg} this payee?`
      )
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this._setLoadingState(true, snackbarMsg);
          const body = this.payeeForm.getRawValue();

          if (this.isUpdate) {
            return this.payeeApi.updatePayeeById(this.data._id, body);
          }

          return this.payeeApi.createPayee(body);
        })
      )
      .subscribe({
        next: () => {
          this._setLoadingState(false);
          this.dialogRef.close(true);
        },
        error: ({ error }: HttpErrorResponse) => {
          this._setLoadingState(false);
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  private _patchFormValues(payee: Payee) {
    this.payeeForm.patchValue(payee);
  }

  private _setLoadingState(isLoading: boolean, message = '') {
    this.isLoading = isLoading;

    if (isLoading) {
      this.payeeForm.disable();
      this.snackbar.openLoadingSnackbar('Please Wait', message);
    } else {
      this.payeeForm.enable();
      this.snackbar.closeLoadingSnackbar();
    }
  }
}

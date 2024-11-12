import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  userForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<EditUserComponent>,
    private readonly confirmation: ConfirmationService,
    private readonly snackbar: SnackbarService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly userApi: UserApiService
  ) {
    this.userForm = this.fb.group({
      name: [this.data.name ?? '', Validators.required],
      email: [this.data.email ?? '', Validators.required],
      designation: [this.data.designation ?? '', Validators.required],
    });
  }

  onSubmit() {
    this.confirmation
      .open('Update Confirmation', 'Do you want to update this user?')
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.userForm.disable();
          const userId = this.data._id;
          const body = this.userForm.getRawValue();
          return this.userApi.updateUserById(userId, body);
        })
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackbar.openSuccessSnackbar(
            'Update Success',
            'User has been updated!'
          );
        },
        error: ({ error }: HttpErrorResponse) => {
          this.userForm.enable();
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }
}

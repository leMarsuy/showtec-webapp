import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '@app/core/models/user.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  userForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    designation: new FormControl('', Validators.required),
  });

  loading = false;

  private destroyed$ = new Subject<void>();
  private user!: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<AccountSettingsComponent>,
    private confirmation: ConfirmationService,
    private snackbar: SnackbarService,
    private userApi: UserApiService,
    private authApi: AuthService,
    private router: Router
  ) {
    if (!data.user) throw new Error('User not found');
    this.user = data.user;
    this.onResetForm();
  }

  ngOnInit() {}

  onResetForm() {
    this.userForm.patchValue(this.user);
    this.userForm.markAsPristine();
  }

  onSave() {
    this.confirmation
      .open('Account Settings Update', 'Would you like to save your changes?')
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.userForm.disable();
          this.loading = true;
          const user = this.userForm.getRawValue() as User;
          this.snackbar.openLoadingSnackbar('Please Wait', 'Saving changes...');
          return this.userApi.updateUserById(this.user._id, user);
        })
      )
      .subscribe({
        next: (user: any) => {
          this.snackbar.closeLoadingSnackbar();
          this.snackbar.openSuccessSnackbar(
            'Success',
            'Your account details have been updated'
          );
          this.user = user;
          this.loading = false;
          this.userForm.enable();
          this.onResetForm();
        },
        error: ({ error }: HttpErrorResponse) => {
          console.error(error.message);
          this.snackbar.openErrorSnackbar(error.errroCode, error.message);
          this.loading = false;
          this.userForm.enable();
        },
      });
  }

  onPasswordResetRequest() {
    this.confirmation
      .open(
        'Password Reset',
        `<p class='text-base'>Would you like to change your password?</p> <br/><p class='text-gray-500 text-sm'>The reset link will be sent to your email and you'll be logout. Please save your activities before proceeding.</p> <br/>`
      )
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.loading = true;
          this.snackbar.openLoadingSnackbar('Please Wait', 'Sending Email...');
          return this.authApi.forgotPassword(this.user.email);
        })
      )
      .subscribe({
        next: () => {
          this.loading = false;
          this.snackbar.closeLoadingSnackbar();
          this._dialogRef.close();
          this.authApi.logout().subscribe({
            error: ({ error }: HttpErrorResponse) => {
              this.snackbar.openErrorSnackbar(error.errorCode, error.message);
            },
            complete: () => {
              this.snackbar.openSuccessSnackbar(
                'Logged Out',
                'You have logged out'
              );
              this.router.navigate(['/auth/login']);
            },
          });
        },
        error: ({ error }: HttpErrorResponse) => {
          this.loading = false;
          console.log(error);
          this.snackbar.openErrorSnackbar(error?.errorCode, error?.message);
        },
      });
  }

  onInputChange(formControl: FormControl) {
    const value = formControl.value;
    formControl.setValue(value.toUpperCase());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

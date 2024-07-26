import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '@app/core/models/user.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    designation: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private userApi: UserApiService,
    private dialogRef: MatDialogRef<AddUserComponent>,
    private snackbarService: SnackbarService
  ) {
    this.generatePassword();
  }

  onSubmit() {
    this.userForm.disable();
    var user = this.userForm.getRawValue() as any;
    this.userApi.createUser(user).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
        this.snackbarService.openSuccessSnackbar(
          'CreateSuccess',
          'User added successfully'
        );
      },
      error: (err: HttpErrorResponse) => {
        this.userForm.enable();
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  generatePassword() {
    const password = Math.random().toString(36).slice(-8);
    this.userForm.get('password')?.setValue(password.toLowerCase());
  }
}

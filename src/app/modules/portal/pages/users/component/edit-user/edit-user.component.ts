import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Status } from '@app/core/enums/status.enum';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { Role } from '@app/core/models/role.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { RoleApiService } from '@app/shared/services/api/role-api/role-api.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { filter, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  userForm!: FormGroup;

  roles$ = new Observable<Role[]>();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<EditUserComponent>,
    private readonly confirmation: ConfirmationService,
    private readonly snackbar: SnackbarService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly roleApiService: RoleApiService,
    private readonly userApi: UserApiService,
  ) {
    this.roles$ = this._fetchRoles();
    this.userForm = this.fb.group({
      name: [this.data.name ?? '', Validators.required],
      email: [this.data.email ?? '', Validators.required],
      designation: [this.data.designation ?? '', Validators.required],
      _roleId: [this.data._roleId ?? '', Validators.required]
    });
  }

  get roleControlValue() {
    return this.userForm.get('_roleId')?.value;
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
          const body = this._formatUserRequest();
          return this.userApi.updateUserById(userId, body);
        }),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackbar.openSuccessSnackbar(
            'Update Success',
            'User has been updated!',
          );
        },
        error: ({ error }: HttpErrorResponse) => {
          this.userForm.enable();
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  compareWith(a: any, b: any) {
    return a._id === b._id;
  }

  private _fetchRoles() {
    const query: QueryParams = {
      status: Status.ACTIVE,
    }
    return this.roleApiService.getRoles(query).pipe(map((response: any) => {
      return response.records.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }))
  }

  private _formatUserRequest() {
    const body = this.userForm.getRawValue();
    const roleId = body._roleId._id;
    body._roleId = roleId;

    return body;
  }
}

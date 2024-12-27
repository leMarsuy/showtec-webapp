import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Status } from '@app/core/enums/status.enum';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { Role } from '@app/core/models/role.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { RoleApiService } from '@app/shared/services/api/role-api/role-api.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  userForm: FormGroup;

  roles$ = new Observable<Role[]>();

  constructor(
    private fb: FormBuilder,
    private userApi: UserApiService,
    private readonly roleApiService: RoleApiService,
    private dialogRef: MatDialogRef<AddUserComponent>,
    private snackbarService: SnackbarService,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      designation: ['', Validators.required],
      password: ['', Validators.required],
      _roleId: ['', Validators.required]
    });

    this.generatePassword();
    this.roles$ = this._fetchRoles();
  }

  get roleControlValue() {
    return this.userForm.get('_roleId')?.value;
  }

  onSubmit() {
    this.userForm.disable();
    const body: any = this._formatUserRequest()
    this.userApi.createUser(body).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
        this.snackbarService.openSuccessSnackbar(
          'CreateSuccess',
          'User added successfully',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.userForm.enable();
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message,
        );
      },
    });
  }

  generatePassword() {
    const password = Math.random().toString(36).slice(-8);
    this.userForm.get('password')?.setValue(password.toLowerCase());
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
      const body: any = this.userForm.getRawValue();
      const roleId = body._roleId._id;
      body._roleId = roleId;
  
      return body;
    }
}

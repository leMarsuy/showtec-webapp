import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NAV_ROUTES, NavRoute } from '@app/core/lists/nav-routes.list';
import { Role } from '@app/core/models/role.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { RoleApiService } from '@app/shared/services/api/role-api/role-api.service';
import { filter, finalize, switchMap } from 'rxjs';

@Component({
  selector: 'app-upsert-role',
  templateUrl: './upsert-role.component.html',
  styleUrl: './upsert-role.component.scss',
})
export class UpsertRoleComponent {
  title = this.data ? 'Update Role' : 'Create Role';
  submitLabel = this.data ? 'Update' : 'Create';
  isUpdate = this.data ? true : false;
  isSubmitting = false;

  private readonly excludedPaths = ['/stock-checker', 'reports/sales'];
  permissions = NAV_ROUTES.reduce(
    (acc: Record<string, string | boolean>[], routeGroup) => {
      const paths = routeGroup.items.flatMap((route: NavRoute) => {
        //if path is in excludedPaths, return empty array
        //else return object {path: route.path, hasAccess: false}
        if (this.excludedPaths.includes(route.path)) return [];
        return [{ name: route.name, path: route.path, hasAccess: false }];
      }, []);

      //returns arc with all paths with hasAccess: false
      return (acc = [...acc, ...paths]);
    },
    [],
  );

  roleForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    permissions: this.fb.array(this.permissions),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Role | undefined,
    public dialogRef: MatDialogRef<UpsertRoleComponent>,
    private roleApiService: RoleApiService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private snackbar: SnackbarService,
  ) {
    if (this.isUpdate && this.data?.permissions) {
      const remapped = this.data.permissions.map((permission) => {
        const hasAccess = permission.hasAccess ? true : false;
        return { ...permission, hasAccess };
      });

      console.log(this.data);
      console.log(remapped);
      this.roleForm.setValue({
        name: this.data?.name,
        permissions: remapped,
      });

      console.log(this.roleForm.getRawValue());
    }
  }

  onPermissionClick(permission: Record<string, string | boolean>) {
    permission['hasAccess'] = !permission['hasAccess'];
  }

  onSubmit() {
    if (this.roleForm.invalid) return;

    this.confirmation
      .open(
        `${this.submitLabel} Confirmation`,
        `Do you want to ${this.submitLabel.toLowerCase()} this role?`,
      )
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          const requestBody = this.roleForm.getRawValue();
          const permissions = requestBody.permissions.map(
            (permission: Record<string, string | boolean>) => ({
              path: permission['path'],
              hasAccess: permission['hasAccess'],
            }),
          );

          requestBody.permissions = permissions;

          const loadingMsg = this.isUpdate
            ? `Updating role...`
            : `Creating role...`;
          this._setSubmittingState(true, loadingMsg);
          if (this.isUpdate && this.data) {
            return this.roleApiService.updateRoleById(
              this.data._id,
              requestBody,
            );
          }
          return this.roleApiService.createRole(requestBody);
        }),
        finalize(() => this._setSubmittingState(false)),
      )
      .subscribe({
        next: () => {
          this.snackbar.openSuccessSnackbar(
            'Success',
            `Role has been ${this.isUpdate ? 'updated' : 'created'}.`,
          );
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 500);
        },
        error: (err) => {
          console.log(err);
          this.snackbar.openErrorSnackbar(
            err.error.errorCode,
            err.error.message,
          );
        },
      });
  }

  private _setSubmittingState(isSubmitting: boolean, loadingMsg = '') {
    this.isSubmitting = isSubmitting;
    this.isSubmitting ? this.roleForm.disable() : this.roleForm.enable();

    if (isSubmitting) {
      this.snackbar.openLoadingSnackbar('Please Wait', loadingMsg);
    } else {
      this.snackbar.closeLoadingSnackbar();
    }
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EXCLUDED_PATHS } from '@app/core/constants/nav-excluded-paths';
import { Status } from '@app/core/enums/status.enum';
import { NAV_ROUTES, NavRoute } from '@app/core/lists/nav-routes.list';
import { Permission, Role } from '@app/core/models/role.model';
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
  isUpdate = this.data ?? false;
  isSubmitting = false;

  private readonly excludedPaths = EXCLUDED_PATHS;

  permissions = NAV_ROUTES.reduce(
    (acc: Record<string, string | boolean>[], routeGroup) => {
      const paths = routeGroup.items.flatMap((route: NavRoute) => {
        //if path is in excludedPaths, return empty array
        //else return object {path: route.path, hasAccess: false}
        if (this.excludedPaths.includes(route.path)) return [];
        return [{ name: route.name, path: route.path, hasAccess: false }];
      }, []);

      //returns arc with all paths with hasAccess: false
      return [...acc, ...paths];
    },
    [],
  );

  roleForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    permissions: this.fb.array(this.permissions),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Role | any,
    public dialogRef: MatDialogRef<UpsertRoleComponent>,
    private roleApiService: RoleApiService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private snackbar: SnackbarService,
  ) {
    this._setPermissionState(this.isUpdate);
  }

  onPermissionClick(permission: Record<string, string | boolean>) {
    permission['hasAccess'] = !permission['hasAccess'];
    this.roleForm.get('permissions')?.markAsDirty();
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
          console.error(err);
          this.snackbar.openErrorSnackbar(
            err.error.errorCode,
            err.error.message,
          );
        },
      });
  }

  resetRole(){
    this._setPermissionState(this.isUpdate);
    this.roleForm.markAsPristine();
  }

  deleteRole() {
    this.confirmation.open('Delete Role', `Do you want to delete this role?`).afterClosed().pipe(filter(result => result), switchMap(() => {
      this._setSubmittingState(true, 'Deleting role...');
      return this.roleApiService.patchRoleStatus(this.data._id, Status.DELETED);
    }), finalize(() => this._setSubmittingState(false))).subscribe({
      next: () => {
        this.snackbar.openSuccessSnackbar(
          'Deletion Success',
          `Role has been deleted.`,
        );
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 500);
      },
      error: ({error} : HttpErrorResponse) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
      }
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

  private _setPermissionState(isUpdate: boolean) {
    if (isUpdate && this.data?.permissions) {
      this.permissions = this.permissions.map((item:Record<string, string | boolean> ) => {
        const matchItem  = this.data.permissions.find((permission: Permission) => permission.path === item['path']);

        if(!matchItem) {
          item['hasAccess'] = false;
        } else {
          item['hasAccess'] = matchItem['hasAccess'] ?? false;
        }
        return item
      })

      this.roleForm.setValue({
        name: this.data?.name,
        permissions: this.permissions,
      });
    }
     
    else {
      this.permissions.forEach((item) => {
        item.hasAccess = false;
      })
    }
  }
}

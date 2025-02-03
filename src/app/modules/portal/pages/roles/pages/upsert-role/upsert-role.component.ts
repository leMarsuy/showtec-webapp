import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Status } from '@app/core/enums/status.enum';
import { Role } from '@app/core/models/role.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { RoleApiService } from '@app/shared/services/api/role-api/role-api.service';
import { isEmpty } from '@app/shared/utils/objectUtil';
import {
  catchError,
  filter,
  finalize,
  lastValueFrom,
  map,
  of,
  switchMap,
} from 'rxjs';
import { RolesService } from '../../roles.service';

@Component({
  selector: 'app-upsert-role',
  templateUrl: './upsert-role.component.html',
  styleUrl: './upsert-role.component.scss',
})
export class UpsertRoleComponent {
  title = this.data ? 'Update Role' : 'Create Role';
  submitLabel = this.data ? 'Update' : 'Create';
  isUpdate = !!this.data;
  isSubmitting = false;

  permissions: any = [];
  permissionState: any = {};

  roleForm: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Role | any,
    public dialogRef: MatDialogRef<UpsertRoleComponent>,
    private roleApiService: RoleApiService,
    private rolesService: RolesService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private snackbar: SnackbarService,
  ) {
    const permissionsFormArray: any = this.fb.array([]);

    this.permissions = this.rolesService.getRolesConfig();

    for (const permission of this.permissions) {
      const permissionGroup = this._roleFormInit(permission);
      permissionsFormArray.push(permissionGroup);
    }

    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      permissions: permissionsFormArray,
    });

    setTimeout(() => {
      if (this.data) {
        this.roleForm.get('name')?.patchValue(this.data.name);
        this._setPermissionState();
      }
    });
  }

  private _roleFormInit(permission: any, parent?: any) {
    const permissionFormGroup: FormGroup = this.fb.group({
      path: permission.path,
      hasAccess: permission?.persistent,
    });

    if (permission?.isChild) {
      this.permissionState[parent.path]['children'][permission.path] = {
        state: permission.persistent,
      };
    } else {
      this.permissionState[permission.path] = {
        state: permission.persistent,
      };
    }

    //Check if permission has method; for the meantime only Purchase Order and Settings/Customer have method property;
    if (permission?.methods) {
      if (permission?.isChild) {
        this.permissionState[parent.path]['children'][permission.path][
          'methods'
        ] = {};
      } else {
        this.permissionState[permission.path]['methods'] = {};
      }

      const methods: any = {};
      Object.keys(permission?.methods).forEach((key) => {
        if (permission.isChild) {
          this.permissionState[parent.path]['children'][permission.path][
            'methods'
          ][key] = {
            state: false,
          };
        } else {
          this.permissionState[permission.path]['methods'][key] = {
            state: false,
          };
        }

        methods[key] = false;
      });

      permissionFormGroup.addControl('methods', this.fb.group(methods));
    }

    //Check if permission has children;
    if (permission?.children?.length) {
      const childrenFormArray: any = this.fb.array([]);

      this.permissionState[permission.path]['children'] = {};

      let childHasPersistent = false;
      permission.children.forEach((child: any) => {
        //Check if child has persistent; true: parent is persistent.
        if (child.persistent) {
          childHasPersistent = true;
        }

        this.permissionState[permission.path]['children'][child.path] = {
          state: child.persistent,
        };

        const childFormGroup = this._roleFormInit(child, permission);
        childrenFormArray.push(childFormGroup);
      });

      if (childHasPersistent) {
        permission.persistent = true;
        this.permissionState[permission.path].state = true;
        permissionFormGroup.controls['hasAccess'].setValue(true);
      }

      permissionFormGroup.addControl('children', childrenFormArray);
    }

    return permissionFormGroup;
  }

  onSubmit() {
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

  resetRole() {
    if (this.data) {
      this._setPermissionState();
    } else {
      for (const key in this.permissionState) {
        const pickedPermission = this.permissions.find(
          (permission: any) => permission.path === key,
        );

        const pickedPermissionState = this.permissionState[key];
        if (
          pickedPermission?.persistent &&
          (!pickedPermission?.methods ||
            pickedPermission?.children?.length === 0)
        ) {
        } else {
          pickedPermissionState.state = false;
        }

        // Parent Methods
        if (pickedPermissionState?.methods) {
          Object.keys(pickedPermissionState?.methods).forEach((key) => {
            pickedPermissionState.methods[key].state = false;
          });
        }

        // Children
        if (pickedPermissionState?.children?.length !== 0) {
          for (const childKey in pickedPermissionState.children) {
            const childPermission = pickedPermission['children'].find(
              (permission: any) => permission.path === childKey,
            );

            if (childPermission.persistent) {
              continue;
            }

            pickedPermissionState.children[childKey].state = false;

            // Children Methods
            if (childPermission?.methods) {
              Object.keys(childPermission.methods).forEach((key) => {
                pickedPermissionState.children[childKey]['methods'][key].state =
                  false;
              });
            }
          }
        }
      }
    }

    this.roleForm.markAsPristine();
  }

  async deleteRole() {
    const roleHasExistingUser$ = this.roleApiService
      .checkRoleIfHasExistingUser(this.data._id)
      .pipe(
        map((result) => result),
        catchError(() => of(false)),
      );
    const hasExistingUser = await lastValueFrom(roleHasExistingUser$);

    if (hasExistingUser) {
      this.snackbar.openErrorSnackbar(
        'Action Denied!',
        'This role have active users',
      );
      return;
    }

    this.confirmation
      .open('Delete Role', `Do you want to delete this role?`)
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this._setSubmittingState(true, 'Deleting role...');
          return this.roleApiService.patchRoleStatus(
            this.data._id,
            Status.DELETED,
          );
        }),
        finalize(() => this._setSubmittingState(false)),
      )
      .subscribe({
        next: () => {
          this.snackbar.openSuccessSnackbar(
            'Deletion Success',
            `Role has been deleted.`,
          );
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 500);
        },
        error: ({ error }: HttpErrorResponse) => {
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
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

  private _setPermissionState() {
    const permissionMap = this.data.permissions.reduce(
      (acc: any, permission: any) => {
        acc[permission.path] = permission;
        return acc;
      },
      {},
    );
    const findLookupInMap = (lookupPath: string, permissionMap: any[]) => {
      return permissionMap.find((item) => item.path === lookupPath);
    };

    this.roleForm.get('permissions')?.patchValue(this.data.permissions);

    this.permissions.forEach((permission: any) => {
      const existingPermission = permissionMap[permission.path];
      const parentPermState = this.permissionState[permission.path];

      parentPermState.state = existingPermission.hasAccess;

      if (permission?.methods) {
        for (const key of Object.keys(permission.methods)) {
          const parentPermMethodState = parentPermState['methods'][key];
          parentPermMethodState.state = existingPermission['methods'][key];
        }
      }

      /**
       * #NOTE: Limitation of current logic; Route must not have "grand children", Route Child must not have children.
       */
      if (existingPermission?.children?.length) {
        for (const child of existingPermission.children) {
          const childPermState =
            this.permissionState[permission.path]['children'][child.path];

          const childPermHasAccess = !!findLookupInMap(
            child.path,
            existingPermission.children,
          ).hasAccess;

          childPermState.state = childPermHasAccess;

          if (childPermHasAccess) {
            childPermState.expanded = true;
          }

          if (child?.methods) {
            for (const key of Object.keys(child.methods)) {
              const childMethodValue = !!child['methods'][key];
              const childPermMethodState =
                this.permissionState[permission.path]['children'][child.path][
                  'methods'
                ][key];

              if (childMethodValue) {
                childPermState.expanded = true;
              }
              childPermMethodState.state = childMethodValue;
            }
          }
        }
      }

      // check if

      if (
        parentPermState.state &&
        (existingPermission?.children?.length || !isEmpty(permission?.methods))
      ) {
        parentPermState.expanded = true;
      } else {
        parentPermState.expanded = false;
      }
    });
  }
}

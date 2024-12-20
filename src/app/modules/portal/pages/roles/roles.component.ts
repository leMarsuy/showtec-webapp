import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';
import { UpsertRoleComponent } from './pages/upsert-role/upsert-role.component';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RolesService } from './roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {
  readonly roleIcon = NavIcon.ROLES;
  readonly roleLabel = 'ROLES';
  readonly actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Create Role',
      icon: 'add',
    },
  ];

  private readonly dialog = inject(MatDialog);
  private readonly rolesService = inject(RolesService);

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this._openCreateRoleDialog();
        break;

      default:
        break;
    }
  }

  private _openCreateRoleDialog() {
    this.dialog
      .open(UpsertRoleComponent, {
        width: '55vw',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((willUpdate) => {
        if (willUpdate) {
          this.rolesService.fetchRoles$.next();
        }
      });
  }
}

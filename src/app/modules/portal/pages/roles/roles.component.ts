import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { UpsertRoleComponent } from './pages/upsert-role/upsert-role.component';
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
  private readonly configApi = inject(ConfigApiService);
  private readonly rolesService = inject(RolesService);

  constructor() {
    this.configApi
      .getRolesConfig()
      .subscribe((roleConfig) => this.rolesService.setRolesConfig(roleConfig));
  }

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

import { Component, ComponentRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';
import { AddUserComponent } from './component/add-user/add-user.component';
import { UsersListComponent } from './pages/users-list/users-list.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  constructor(private dialog: MatDialog) {}

  // content header
  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Add User Profile',
      icon: 'add',
    },
  ];

  private userList!: UsersListComponent;

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this._openAddUserDialog();
        break;

      default:
        break;
    }
  }

  getUserListComponentFromRouterOutlet(e: any) {
    if (e instanceof UsersListComponent) {
      this.setUserList(e);
    }
  }

  private _openAddUserDialog() {
    this.dialog
      .open(AddUserComponent, {
        maxWidth: '60rem',
        width: '60rem',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((hasUpdate) => {
        if (hasUpdate && this.userList) {
          this.userList.getUsers();
        }
      });
  }

  private setUserList(component: UsersListComponent) {
    this.userList = component;
  }
}

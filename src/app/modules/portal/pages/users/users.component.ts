import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';
import { AddUserComponent } from './component/add-user/add-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  constructor(private router: Router, private dialog: MatDialog) {}

  // content header

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Add User Profile',
      icon: 'add',
    },
  ];

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.dialog
          .open(AddUserComponent, {
            maxWidth: '60rem',
            width: '60rem',
            disableClose: true,
          })
          .afterClosed()
          .subscribe((res) => {
            // refresh table here
          });
        // this.router.navigate(['/portal/out-delivery/create']);
        break;

      default:
        break;
    }
  }
}

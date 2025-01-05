import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.scss',
})
export class VouchersComponent {
  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Create Voucher',
      icon: 'add',
    },
  ];
  constructor(private router: Router) {}
  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.router.navigate([PORTAL_PATHS.vouchers.createUrl]);
        break;

      default:
        break;
    }
  }
}

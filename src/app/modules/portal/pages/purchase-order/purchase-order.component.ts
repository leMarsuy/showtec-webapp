import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
})
export class PurchaseOrderComponent {
  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Create Purchase Order',
      icon: 'add',
    },
  ];

  constructor(private router: Router) {}
  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.router.navigate([PORTAL_PATHS.purchaseOrders.createUrl]);
        break;

      default:
        break;
    }
  }
}

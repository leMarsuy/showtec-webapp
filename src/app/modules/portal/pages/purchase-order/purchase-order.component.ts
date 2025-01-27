import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import {
  ContentHeaderAction,
  ContentHeaderActionType,
} from '@app/core/interfaces/content-header-action.interface';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import { AddNewCustomerComponent } from './add-new-customer/add-new-customer.component';
import { PurchaseOrderService } from './purchase-order.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
})
export class PurchaseOrderComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(SnackbarService);
  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly customerApi = inject(CustomerApiService);

  private addExistingCustomerActionOption = {
    id: 'add-with-existing-customer',
    name: 'With Existing Customer',
    icon: 'person_search',
  };

  constructor() {
    this.customerApi.hasCustomer().subscribe((hasCustomer) => {
      if (!hasCustomer) return;
      const addAction = this.actions.find((item) => item.id === 'add');
      addAction?.items?.push(this.addExistingCustomerActionOption);
    });
  }

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Create Purchase Order',
      icon: 'add',
      type: ContentHeaderActionType.Menu,
      items: [
        {
          id: 'add-with-new-customer',
          name: 'With New Customer',
          icon: 'person_add',
        },
      ],
    },
  ];

  actionEvent(action: string) {
    switch (action) {
      case 'add-with-existing-customer':
        this.router.navigate([PORTAL_PATHS.purchaseOrders.createUrl]);
        break;
      case 'add-with-new-customer':
        this._openAddNewCustomer();
        break;

      default:
        break;
    }
  }

  private _openAddNewCustomer() {
    this.dialog
      .open(AddNewCustomerComponent, {
        width: '55vw',
        height: '65vh',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((customer) => {
        if (!customer) return;

        this.snackbar.openInfoSnackbar(
          'Customer Added Successfully!',
          'Navigating to Purchase Order creating',
        );
        this.purchaseOrderService.setCustomer(customer);
        this.router.navigate([PORTAL_PATHS.purchaseOrders.createUrl]);
      });
  }
}

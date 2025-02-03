import { Injectable } from '@angular/core';
import { Customer } from '@app/core/models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private customer: Customer | null = null;

  setCustomer(newCustomer: Customer) {
    this.customer = newCustomer;
  }

  getCustomer() {
    return this.customer as Customer;
  }

  resetCustomer() {
    this.customer = null;
  }
}

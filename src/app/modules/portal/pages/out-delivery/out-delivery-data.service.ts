import { Injectable } from '@angular/core';
import { Customer } from '@app/core/models/customer.model';
import {
  OutDelivery,
  OutDeliveryItems,
} from '@app/core/models/out-delivery.model';

interface ReuseOutDelivery {
  _customerId: Partial<Customer> | string;
  _purchaseOrderId: string | null;
  STATIC: any;
  items: Partial<OutDeliveryItems>[];
}

@Injectable({
  providedIn: 'root',
})
export class OutDeliveryDataService {
  private outDelivery: ReuseOutDelivery | null = null;

  constructor() {}

  get OutDelivery() {
    return this.outDelivery;
  }

  setOutDelivery(outDelivery: OutDelivery) {
    this.outDelivery = this._formatOutDeliveryForReuse(outDelivery);
  }

  deleteOutDelivery() {
    this.outDelivery = null;
  }

  private _formatOutDeliveryForReuse(
    outDelivery: OutDelivery
  ): ReuseOutDelivery {
    const items = outDelivery.items.map((item: OutDeliveryItems) => item);

    return {
      _customerId: outDelivery._customerId,
      _purchaseOrderId: outDelivery?._purchaseOrderId ?? null,
      STATIC: outDelivery.STATIC,
      items,
    };
  }
}

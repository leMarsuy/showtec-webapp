import { Injectable } from '@angular/core';
import { Customer } from '@app/core/models/customer.model';
import { Discount, SOA, SOAItems, Tax } from '@app/core/models/soa.model';

interface ReuseSoa {
  _customerId: Partial<Customer> | string;
  _purchaseOrderId: string | null;
  STATIC: any;
  items: Partial<SOAItems>[];
  discounts: Partial<Discount>[];
  taxes: Partial<Tax>[];
}

@Injectable({
  providedIn: 'root',
})
export class SoaDataService {
  private soa: ReuseSoa | null = null;

  get Soa() {
    return this.soa;
  }

  constructor() {}

  setSoa(soa: SOA) {
    this.soa = this._formatSoaForReuse(soa);
  }

  deleteSoa() {
    this.soa = null;
  }

  private _formatSoaForReuse(soa: SOA): ReuseSoa {
    const items = soa.items.map((item: SOAItems) => item);
    const discounts =
      soa.discounts?.map((discount: Discount) => discount) ?? [];
    const taxes = soa.taxes?.map((tax: Tax) => tax) ?? [];

    return {
      _customerId: soa._customerId,
      _purchaseOrderId: soa._purchaseOrderId ?? null,
      STATIC: soa.STATIC,
      items,
      discounts,
      taxes,
    };
  }
}

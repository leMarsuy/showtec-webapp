import { OutDeliveryStatus } from '../enums/out-delivery-status.enum';
import { OrderedFrom } from '../enums/purchase-order-ordered-from';
import { PurchaseOrderStatus } from '../enums/purchase-order.enum';
import { Customer } from './customer.model';
import { Signatory } from './out-delivery.model';
import { Discount, Tax, Transaction } from './soa.model';

export interface PuchaseOrderItems {
  _productId: string;
  STATIC: {
    sku: string;
    brand: string;
    model: string;
    unit_price: number;
    quantity: number;
    disc: number;
    total: number;
    classification: string;
  };
}

interface PurchaseOrderOutDelivery {
  code: {
    sequence: number;
    year: number;
    month: number;
    value: string;
  };
  _outDeliveryId: string;
  status: OutDeliveryStatus;
}

interface PurchaseOrderSoa {
  _soaId: string;
  code: {
    sequence: number;
    year: number;
    month: number;
    value: string;
  };
}
export class PurchaseOrder {
  _id?: string;
  code?: {
    sequence: number;
    year: number;
    month: number;
    value: string;
  };
  _customerId: Customer | string;
  STATIC: {
    name: string;
    mobile: string;
    address: string;
    tin?: string;
  };
  summary?: {
    total: number;
    productDiscount: number;
    subtotal: number;
    grandtotal: number;
  };
  payment?: {
    balance: number;
    paid: number;
  };
  transactions?: Transaction[];
  purchaseOrderDate: Date;
  dueDate?: Date;
  signatories: Signatory[];
  items: PuchaseOrderItems[];
  remarks: string;
  status?: PurchaseOrderStatus;
  createdAt?: string;
  updatedAt?: string;
  discounts?: Array<Discount>;
  taxes?: Array<Tax>;
  orderedFrom?: OrderedFrom;
  outDeliveries: PurchaseOrderOutDelivery | [];
  soa?: PurchaseOrderSoa;

  constructor(model: PurchaseOrder) {
    this._id = model._id;
    this.code = model.code;
    this._customerId = model._customerId;
    this.STATIC = model.STATIC;
    this.purchaseOrderDate = model.purchaseOrderDate;
    this.dueDate = model.dueDate;
    this.signatories = model.signatories;
    this.items = model.items;
    this.remarks = model.remarks;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.outDeliveries = model.outDeliveries;
    this.soa = model.soa;
    this.orderedFrom = model.orderedFrom;
  }
}

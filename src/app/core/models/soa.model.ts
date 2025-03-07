import { PaymentMethod } from '../enums/payment-method.enum';
import { SoaStatus } from '../enums/soa-status.enum';
import { Status } from '../enums/status.enum';
import { Signatory } from './out-delivery.model';

export interface SOAItems {
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

export interface Discount {
  name: string;
  value: number;
}

export interface Transaction {
  paymentMethod: PaymentMethod;
  amount: number;
  paymentDate: Date;
  remarks?: string;
  recordedBy?: string;
}

export interface Tax {
  name: string;
  value: number;
}

export class SOA {
  _id?: string;
  code?: {
    sequence: number;
    year: number;
    month: number;
    value: string;
  };
  _customerId: string;
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
  soaDate: Date;
  dueDate?: Date;
  signatories: Signatory[];
  items: SOAItems[];
  remarks: string;
  status?: SoaStatus;
  createdAt?: string;
  updatedAt?: string;
  discounts?: Array<Discount>;
  taxes?: Array<Tax>;

  _purchaseOrderId?: string;

  constructor(model: SOA) {
    this._id = model._id;
    this.code = model.code;
    this._customerId = model._customerId;
    this.STATIC = model.STATIC;
    this.soaDate = model.soaDate;
    this.dueDate = model.dueDate;
    this.signatories = model.signatories;
    this.items = model.items;
    this.remarks = model.remarks;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this._purchaseOrderId = model._purchaseOrderId;
  }
}

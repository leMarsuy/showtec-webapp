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
  };
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
  };
  soaDate: Date;
  dueDate?: Date;
  signatories: Signatory[];
  items: SOAItems[];
  status?: Status;
  createdAt?: string;
  updatedAt?: string;
  disc?: number;
  constructor(model: SOA) {
    this._id = model._id;
    this.code = model.code;
    this._customerId = model._customerId;
    this.STATIC = model.STATIC;
    this.soaDate = model.soaDate;
    this.dueDate = model.dueDate;
    this.signatories = model.signatories;
    this.items = model.items;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}

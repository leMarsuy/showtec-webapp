import { OutDeliveryStatus } from '../enums/out-delivery-status.enum';

export interface Signatory {
  _userId: string;
  STATIC: {
    name: string;
    designation: string;
  };
  action: string;
}

export interface OutDeliveryItems {
  _productId: string;
  STATIC: {
    _stockId: string;
    sku: string;
    brand: string;
    model: string;
    serialNumber: string;
    classification: string;
    status: string;
    remarks?: string;
  };
}

export class OutDelivery {
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
  deliveryDate: Date;
  actualDeliveryDate?: Date;
  remarks?: string;
  signatories: Signatory[];
  items: OutDeliveryItems[];
  status?: OutDeliveryStatus;
  createdAt?: string;
  updatedAt?: string;
  _purchaseOrderId?: string;

  // billing address
  // delivery address
  // customer code
  // customer type
  // contactPerson (if not individual)

  constructor(model: OutDelivery) {
    this._id = model._id;
    this.code = model.code;
    this._customerId = model._customerId;
    this.STATIC = model.STATIC;
    this.deliveryDate = model.deliveryDate;
    this.actualDeliveryDate = model.actualDeliveryDate;
    this.remarks = model.remarks;
    this.signatories = model.signatories;
    this.items = model.items;

    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this._purchaseOrderId = model._purchaseOrderId;
  }
}

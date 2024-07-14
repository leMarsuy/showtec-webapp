import { CustomerType } from '../enums/customer-type.enum';
import { Status } from '../enums/status.enum';

export class Customer {
  _id: string;
  code: string;
  name: string;
  type: CustomerType;
  contactPerson: string;
  email: string;
  mobile: string;
  addressDelivery: string;
  addressBilling: string;
  remarks: string;
  status: Status;
  createdAt: string;
  updatedAt: string;

  // billing address
  // delivery address
  // customer code
  // customer type
  // contactPerson (if not individual)

  constructor(model: Customer) {
    this._id = model._id;
    this.code = model.code;
    this.name = model.name;
    this.type = model.type;
    this.contactPerson = model.contactPerson;
    this.email = model.email;
    this.mobile = model.mobile;
    this.addressDelivery = model.addressDelivery;
    this.addressBilling = model.addressBilling;
    this.remarks = model.remarks;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}

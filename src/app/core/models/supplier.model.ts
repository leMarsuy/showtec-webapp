import { Status } from '../enums/status.enum';

export class Supplier {
  _id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  mobile: string;
  address: string;
  remarks: string;
  status: Status;
  createdAt: string;
  updatedAt: string;

  constructor(model: Supplier) {
    this._id = model._id;
    this.code = model.code;
    this.name = model.name;
    this.contactPerson = model.contactPerson;
    this.email = model.email;
    this.mobile = model.mobile;
    this.address = model.address;
    this.remarks = model.remarks;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}

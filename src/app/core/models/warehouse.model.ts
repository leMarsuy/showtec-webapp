import { Status } from '../enums/status.enum';

export class Warehouse {
  _id: string;
  code: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  remarks: string;
  status: Status;
  createdAt: string;
  updatedAt: string;

  constructor(model: Warehouse) {
    this._id = model._id;
    this.code = model.code;
    this.name = model.name;
    this.email = model.email;
    this.mobile = model.mobile;
    this.address = model.address;
    this.remarks = model.remarks;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}

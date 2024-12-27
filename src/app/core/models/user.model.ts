import { Status } from '../enums/status.enum';
import { Permission } from './role.model';

export class User {
  _id: string;
  name: string;
  email: string;
  designation: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
  _roleId?: string;

  constructor(model: User) {
    this._id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.designation = model.designation;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this._roleId = model._roleId;
    this.permissions = this.permissions ?? [];
  }
}

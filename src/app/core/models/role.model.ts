import { Status } from '../enums/status.enum';

export interface Permission {
  path: string;
  hasAccess: boolean;
  children?: Permission;
}

export class Role {
  _id: string;
  name: string;
  permissions?: Permission[];
  status: Status;
  createdAt: string;
  updatedAt: string;

  constructor(model: Role) {
    this._id = model._id;
    this.name = model.name;
    this.permissions = model.permissions;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}

import { Status } from '../enums/status.enum';

export class User {
  _id: string;
  name: string;
  email: string;
  status: Status;
  createdAt: string;
  updatedAt: string;

  constructor(model: User) {
    this._id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}

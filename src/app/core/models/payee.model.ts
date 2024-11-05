export class Payee {
  _id: string;
  name: string;

  constructor(model: Payee) {
    this._id = model._id;
    this.name = model.name;
  }
}

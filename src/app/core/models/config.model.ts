export class Config {
  _id: string;
  name: string;
  data: any;
  constructor(model: Config) {
    this._id = model._id;
    this.name = model.name;
    this.data = model.data;
  }
}

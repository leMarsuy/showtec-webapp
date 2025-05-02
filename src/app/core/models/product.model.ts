import { Stock } from './stock.model';

export class Product {
  _id: string;
  brand: string;
  model: string;
  description?: string;
  classification?: string;
  sku: string;
  price: {
    amount: number;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
  status?: string;
  remarks?: string;
  stocks: Stock[];
  _$stockSummary: any;

  $$expectedOrders?: any; //wont be use

  constructor(model: Product) {
    this._id = model._id;
    this.brand = model.brand;
    this.model = model.model;
    this.description = model.description;
    this.classification = model.classification;
    this.sku = model.sku;
    this.price = model.price;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.stocks = model.stocks || [];
    this._$stockSummary = model._$stockSummary;
    this.status = model.status || 'Active';
  }
}

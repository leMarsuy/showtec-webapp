import { StockStatus } from '../enums/stock-status.enum';
import { StockType } from '../enums/stock-type.enum';

export class Stock {
  _id: string;
  serialNumber: string;
  _supplierId?: string;
  _warehouseId: any;
  purchaseDate?: Date;
  purchaseCost?: Number;
  scanDate?: Date;
  type: StockType;
  remarks?: string;
  status: StockStatus;
  model?: string;

  constructor(model: Stock) {
    this._id = model._id;
    this.serialNumber = model.serialNumber;
    this._supplierId = model._supplierId;
    this._warehouseId = model._warehouseId;
    this.purchaseDate = model.purchaseDate;
    this.purchaseCost = model.purchaseCost;
    this.scanDate = model.scanDate;
    this.type = model.type;
    this.remarks = model.remarks;
    this.status = model.status;
    this.model = model.model;
  }
}

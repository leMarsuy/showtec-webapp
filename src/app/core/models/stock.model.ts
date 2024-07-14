export class Stock {
  serialNumber: string;
  quantity: number;
  _supplierId?: string;
  _warehouseId?: string;
  purchaseDate?: Date;
  purchaseCost?: Number;
  scanDate: Date;
  remarks?: string;
  status: 'In Stock' | 'Out of Stock' | 'Reserved';

  constructor(model: Stock) {
    this.serialNumber = model.serialNumber;
    this.quantity = model.quantity;
    this._supplierId = model._supplierId;
    this._warehouseId = model._warehouseId;
    this.purchaseDate = model.purchaseDate;
    this.purchaseCost = model.purchaseCost;
    this.scanDate = model.scanDate;
    this.remarks = model.remarks;
    this.status = model.status;
  }
}

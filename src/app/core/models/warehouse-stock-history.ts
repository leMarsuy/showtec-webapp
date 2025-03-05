export interface WarehouseStockHistory {
  _formWarehouseId: string;
  _toWarehouseId: string;
  sku: string;
  serialNumber: string;
  stockType: string;
  _stockIds: string[];
  _productId: string;
  quantity: number;
  status: string;
  createdBy: {
    _userId: string;
    name: string;
  };
}

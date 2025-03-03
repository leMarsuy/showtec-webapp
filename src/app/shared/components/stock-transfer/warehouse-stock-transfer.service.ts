import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WarehouseStock } from './stock-transfer.component';

@Injectable({
  providedIn: 'root',
})
export class WarehouseStockTransferService {
  private _warehouseState: any = {
    A: {
      selected: [],
    },
    B: {
      selected: [],
    },
  };
  changedStocks: any[] = [];

  private _listChanged$ = new Subject<void>();
  private _resetClicked$ = new Subject<void>();

  get resetClicked$() {
    return this._resetClicked$;
  }

  get listChanged$() {
    return this._listChanged$;
  }

  get warehouseState() {
    return this._warehouseState;
  }

  set warehouseState(value) {
    this._warehouseState = value;
  }

  get warehouseAState() {
    return this._warehouseState.A;
  }

  get warehouseBState() {
    return this._warehouseState.B;
  }

  set warehouseAState(value) {
    this._warehouseState.A = value;
  }

  set warehouseBState(value) {
    this._warehouseState.B = value;
  }

  constructor() {}

  listChange() {
    this._listChanged$.next();
  }

  resetClick() {
    this._resetClicked$.next();
  }

  setChangedStocks() {
    const changedStocks = [];
    for (const warehouseName of ['A', 'B']) {
      const warehouseState = this.warehouseState[warehouseName];

      const idMap = warehouseState.immutable.reduce(
        (acc: any, stock: WarehouseStock) => {
          acc[stock._id] = stock;
          return acc;
        },
        {},
      );

      for (const stock of warehouseState.original) {
        const stockId = stock._id;

        if (
          !idMap[stockId] ||
          (idMap[stockId] && idMap[stockId].quantity !== stock.quantity)
        ) {
          changedStocks.push({
            _productId: stock._productId,
            _warehouseId:
              stock._warehouseId === 'none' ? undefined : stock._warehouseId,
            quantity: stock.quantity,
            serial: stock.serialNumber,
            _stockIds: stock._stockIds,
          });
        }
      }
    }

    this.changedStocks = changedStocks;
  }
}

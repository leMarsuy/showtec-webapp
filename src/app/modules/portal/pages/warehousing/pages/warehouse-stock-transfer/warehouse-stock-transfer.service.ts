import { Injectable } from '@angular/core';
import { StockType } from '@app/core/enums/stock-type.enum';
import { BehaviorSubject, Subject } from 'rxjs';

export interface StockTransferHistory {
  stockId: string;
  type: StockType;
  fromWarehouseId: string;
  toWarehouseId: string;
}

@Injectable({
  providedIn: 'root',
})
export class WarehouseStockTransferService {
  private transferHistory$$ = new BehaviorSubject<StockTransferHistory[]>([]);
  transferHistory$ = this.transferHistory$$.asObservable();

  resetHistory() {
    this.transferHistory$$.next([]);
  }

  setHistory(history: StockTransferHistory[]) {
    this.transferHistory$$.next(history);
  }

  hasHistory() {
    const historyValue = this.transferHistory$$.getValue();
    return historyValue.length;
  }

  resetFormListener$$ = new Subject<void>();
  populateStockListener$$ = new Subject<void>();

  // Batch Move State
  private batchMoveState$$ = new Subject<boolean>();
  batchMoveState$ = this.batchMoveState$$.asObservable();

  setBatchMoveState(isBatchMove: boolean) {
    this.batchMoveState$$.next(isBatchMove);
  }

  // isDraggable State
  private draggableState$$ = new Subject<boolean>();
  draggableState$ = this.draggableState$$.asObservable();

  setDraggableState(isDraggable: boolean) {
    this.draggableState$$.next(isDraggable);
  }
}

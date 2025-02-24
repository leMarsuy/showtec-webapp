import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Stock } from '@app/core/models/stock.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { isEmpty } from '@app/shared/utils/objectUtil';
import {
  BehaviorSubject,
  distinctUntilChanged,
  lastValueFrom,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { SelectTransferQuantityComponent } from './components/select-transfer-quantity/select-transfer-quantity.component';
import { StockDropEventEmitted } from './components/stock-drop-list/stock-drop-list.component';
import {
  StockTransferHistory,
  WarehouseStockTransferService,
} from './warehouse-stock-transfer.service';
import { mockObj } from './warehouse.mock';

export interface TransferStock extends Stock {
  quantity?: number;
}

@Component({
  selector: 'app-warehouse-stock-transfer',
  templateUrl: './warehouse-stock-transfer.component.html',
  styleUrl: './warehouse-stock-transfer.component.scss',
})
export class WarehouseStockTransferComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private confirmation = inject(ConfirmationService);
  private dialog = inject(MatDialog);
  private warehouseStockTransferService = inject(WarehouseStockTransferService);

  private destroyed$ = new Subject<void>();

  warehouseList: any = Object.entries(mockObj).reduce(
    (acc: any, [key, value]: any) => {
      const useKey = key || 'no-warehouse';
      acc.push({
        _id: useKey,
        name: value.name,
      });

      return acc;
    },
    [],
  );

  isBatchMove = true;

  warehouseListA$ = new BehaviorSubject<any>([]);
  warehouseListB$ = new BehaviorSubject<any>([]);

  previousWarehouseA = null;
  previousWarehouseB = null;

  formGroupA = this.fb.group({
    warehouse: this.fb.control({}),
    stocks: this.fb.array([]),
    checkedStocks: this.fb.control([]),
    immutableStocks: this.fb.array([]),
  });

  formGroupB = this.fb.group({
    warehouse: this.fb.control({}),
    stocks: this.fb.array([]),
    checkedStocks: this.fb.control([]),
    immutableStocks: this.fb.array([]),
  });

  transferHistory: StockTransferHistory[] = [];

  navigateBack() {
    //#NOTE: Change it to constant path
    this.router.navigate(['portal/warehousing']);
  }

  constructor() {
    this.warehouseListA$.next(this.warehouseList);
    this.warehouseListB$.next(this.warehouseList);
  }

  logHistory() {
    console.log(this.transferHistory);
  }

  ngOnInit(): void {
    this.formGroupA.controls['warehouse'].valueChanges
      .pipe(distinctUntilChanged(), startWith({}), takeUntil(this.destroyed$))
      .subscribe((warehouse) => {
        this.setDraggableState(
          warehouse,
          this.formGroupB.controls['warehouse'].value,
        );
        this.warehouseChange(this.formGroupA, warehouse, this.warehouseListB$);
      });

    this.formGroupB.controls['warehouse'].valueChanges
      .pipe(distinctUntilChanged(), startWith({}), takeUntil(this.destroyed$))
      .subscribe((warehouse) => {
        this.setDraggableState(
          warehouse,
          this.formGroupA.controls['warehouse'].value,
        );
        this.warehouseChange(this.formGroupB, warehouse, this.warehouseListA$);
      });

    this.warehouseStockTransferService.resetFormListener$$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this._resetForms();
      });
  }

  setDraggableState(fromWarehouse: any, toWarehouse: any) {
    let state = false;
    if (fromWarehouse._id && toWarehouse._id) {
      state = true;
    }
    this.warehouseStockTransferService.setDraggableState(state);
  }

  async warehouseChange(
    formGroup: FormGroup,
    warehouse: any,
    affectedWarehouseList: BehaviorSubject<any>,
  ) {
    if (isEmpty(warehouse)) return;

    this.transferHistory = [];
    this._setTransferHistory();

    const removedChosenWarehouseFromList = this.warehouseList.filter(
      (item: any) => item._id !== warehouse._id,
    );

    affectedWarehouseList.next(removedChosenWarehouseFromList);
    this._populateStocksFromSource(formGroup);
  }

  onEmitCheckedStocks(checkedStocks: any, formControl: FormControl) {
    formControl.setValue(checkedStocks);
  }

  onEmitDropStock(
    event: StockDropEventEmitted,
    fromFormGroup: FormGroup,
    toFormGroup: FormGroup,
  ) {
    if (!this.isBatchMove) {
      this._openTransferStockByQuantity(fromFormGroup, toFormGroup, event);
      return;
    }

    const fromWarehouseId =
      fromFormGroup.controls['warehouse'].getRawValue()._id !== 'no-warehouse'
        ? fromFormGroup.controls['warehouse'].getRawValue()._id
        : '';

    const toWarehouseId =
      toFormGroup.controls['warehouse'].getRawValue()._id !== 'no-warehouse'
        ? toFormGroup.controls['warehouse'].getRawValue()._id
        : '';

    const fromStocksFormArray = fromFormGroup.controls['stocks'] as FormArray;
    const fromStocksGroups = fromStocksFormArray.controls;
    const stockFormGroup = fromStocksFormArray.at(event.previousIndex);
    const stock = stockFormGroup.getRawValue();

    fromFormGroup.controls['checkedStocks'].patchValue([]);

    fromStocksGroups.splice(event.previousIndex, 1);

    const toStocksFormArray = toFormGroup.controls['stocks'] as FormArray;
    toStocksFormArray.insert(event.currentIndex, stockFormGroup);

    const history: StockTransferHistory = {
      fromWarehouseId,
      toWarehouseId,
      stockId: stock._id,
      type: stock.type,
    };

    this._validateTransferHistory(history);
    this._refreshStockList();
  }

  private async _openTransferStockByQuantity(
    fromFormGroup: FormGroup,
    toFormGroup: FormGroup,
    dropEvent?: StockDropEventEmitted,
  ) {
    const fromWarehouse = fromFormGroup.controls['warehouse'].getRawValue();
    const toWarehouse = toFormGroup.controls['warehouse'].getRawValue();
    let useStocks = fromFormGroup.controls['checkedStocks'].getRawValue();
    let isArray = true;

    // You can only drop one item at a time
    if (dropEvent) {
      useStocks =
        fromFormGroup.controls['stocks'].value[dropEvent.previousIndex];
      isArray = false;
    }

    const afterClosed$ = this.dialog
      .open(SelectTransferQuantityComponent, {
        data: {
          stocks: useStocks,
          warehouse: {
            fromWarehouse,
            toWarehouse,
          },
          isArray,
        },
        autoFocus: false,
        disableClose: true,
        minWidth: '75vw',
        maxWidth: '75vw',
      })
      .afterClosed();

    const dialogResponse = await lastValueFrom(afterClosed$);
    if (!dialogResponse) return;
  }

  shouldTransfer(fromFormGroup: FormGroup, toFormGroup: FormGroup) {
    let result = true;
    if (
      !fromFormGroup.controls['warehouse'].value?._id ||
      !toFormGroup.controls['warehouse'].value?._id
    ) {
      result = false;
    }
    if (!fromFormGroup.controls['checkedStocks'].value.length) {
      result = false;
    }

    return result;
  }

  transferStocks(fromFormGroup: FormGroup, toFormGroup: FormGroup) {
    if (!this.isBatchMove) {
      this._openTransferStockByQuantity(fromFormGroup, toFormGroup);
      return;
    }

    const fromWarehouseId =
      fromFormGroup.controls['warehouse'].getRawValue()._id !== 'no-warehouse'
        ? fromFormGroup.controls['warehouse'].getRawValue()._id
        : '';

    const toWarehouseId =
      toFormGroup.controls['warehouse'].getRawValue()._id !== 'no-warehouse'
        ? toFormGroup.controls['warehouse'].getRawValue()._id
        : '';

    const fromStockList = fromFormGroup.controls['stocks'].getRawValue();
    const toStockList = toFormGroup.controls['stocks'].getRawValue();

    const toMoveStocksFormArray: any =
      this._convertStockArrayToArrayForm(toStockList);

    const stocksToBeMoved =
      fromFormGroup.controls['checkedStocks'].getRawValue();

    const excludeStockIds: string[] = [];
    for (const stock of stocksToBeMoved) {
      const history: StockTransferHistory = {
        toWarehouseId,
        fromWarehouseId,
        stockId: stock._id,
        type: stock.type,
      };

      const toMoveStocksFormGroup = this.fb.group({
        _id: stock._id,
        serialNumber: stock.serialNumber,
        type: stock.type,
        model: stock.model,
        status: stock.status,
        quantity: stock.quantity,
        _warehouseId: stock.toWarehouseId,
      });

      //TODO: Handle per quantity move
      this._validateTransferHistory(history);
      toMoveStocksFormArray.push(toMoveStocksFormGroup);
      excludeStockIds.push(stock._id);
    }

    toFormGroup.setControl('stocks', toMoveStocksFormArray);

    const remainingStocks = fromStockList.filter(
      (item: Stock) => !excludeStockIds.includes(item._id),
    );

    if (!remainingStocks.length) {
      fromFormGroup.setControl('stocks', new FormArray([]));
    } else {
      const remainingFormArray: any =
        this._convertStockArrayToArrayForm(remainingStocks);
      fromFormGroup.setControl('stocks', remainingFormArray);
    }
    fromFormGroup.controls['checkedStocks'].setValue([]);

    this._refreshStockList();
  }

  private _populateStocksFromSource(formGroup: FormGroup) {
    const warehouseId = formGroup.get('warehouse')?.value._id;
    const stocksFromReference = (mockObj as any)[warehouseId].stocks ?? [];
    const formArray: FormArray<any> =
      this._convertStockArrayToArrayForm(stocksFromReference);

    formGroup.setControl('stocks', formArray);
    formGroup.setControl('immutableStocks', formArray);
  }

  private _validateTransferHistory(newHistory: StockTransferHistory) {
    const foundStockIdHistory = this.transferHistory.find(
      (history) => history.stockId === newHistory.stockId,
    );

    if (!foundStockIdHistory) {
      this.transferHistory.push(newHistory);
      this._setTransferHistory();
      return;
    }

    this.transferHistory = this.transferHistory.filter(
      (history) => history.stockId !== newHistory.stockId,
    );
    this._setTransferHistory();
  }

  private _resetForms() {
    const aStockArray = this.formGroupA.controls['immutableStocks'];
    const bStockArray = this.formGroupB.controls['immutableStocks'];

    this.formGroupA.setControl('stocks', aStockArray);
    this.formGroupB.setControl('stocks', bStockArray);
    this.transferHistory = [];

    this._refreshStockList();
    this._setTransferHistory();
  }

  private _convertStockArrayToArrayForm(array: any[]): FormArray {
    const formArray = new FormArray([] as any);
    for (const stock of array) {
      const stockFormGroup = new FormGroup({
        _id: new FormControl(stock._id),
        serialNumber: new FormControl(stock.serialNumber),
        type: new FormControl(stock.type),
        model: new FormControl(stock.model),
        status: new FormControl(stock.status ?? 'In Stock'),
        quantity: new FormControl(stock.quantity),
        _warehouseId: new FormControl(stock.warehouseId ?? ''),
      });

      formArray.push(stockFormGroup);
    }
    return formArray;
  }

  private _refreshStockList() {
    this.warehouseStockTransferService.populateStockListener$$.next();
  }

  private _setTransferHistory() {
    this.warehouseStockTransferService.setHistory(this.transferHistory);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();

    this.warehouseListA$.complete();
    this.warehouseListB$.complete();
  }
}

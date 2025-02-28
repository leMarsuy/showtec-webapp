import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StockWarehouseState } from '@app/core/enums/warehouse.enum';
import { Stock } from '@app/core/models/stock.model';
import { Warehouse } from '@app/core/models/warehouse.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { WarehouseApiService } from '@app/shared/services/api/warehouse-api/warehouse-api.service';
import { isEmpty } from '@app/shared/utils/objectUtil';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  lastValueFrom,
  map,
  of,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { SelectTransferQuantityComponent } from './components/select-transfer-quantity/select-transfer-quantity.component';
import {
  StockTransferHistory,
  WarehouseStockTransferService,
} from './warehouse-stock-transfer.service';

export interface TransferStock extends Stock {
  quantity?: number;
  sku: string;
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
  private snackbar = inject(SnackbarService);
  private warehouseApi = inject(WarehouseApiService);
  private dialog = inject(MatDialog);
  private warehouseStockTransferService = inject(WarehouseStockTransferService);

  private destroyed$ = new Subject<void>();

  warehouseList: any = [
    {
      _id: StockWarehouseState.NO_WAREHOUSE,
      name: 'No Warehouse',
      code: '',
    },
  ];

  isBatchMove = true;

  warehouseListA$ = new BehaviorSubject<any>([]);
  warehouseListB$ = new BehaviorSubject<any>([]);

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
    this.warehouseApi.getWarehouses().subscribe((response: any) => {
      const warehouses = response.records as Warehouse[];
      const remappedWarehouses = warehouses.map((warehouse) => ({
        _id: warehouse._id,
        name: warehouse.name,
        code: warehouse.code,
      }));
      this.warehouseList.push(...remappedWarehouses);

      this.warehouseListA$.next(this.warehouseList);
      this.warehouseListB$.next(this.warehouseList);
    });
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
    transferStock: TransferStock,
    fromFormGroup: FormGroup,
    toFormGroup: FormGroup,
  ) {
    if (!this.isBatchMove) {
      this._openTransferStockByQuantity(
        fromFormGroup,
        toFormGroup,
        transferStock,
      );
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

    const fromStocksArrayRaw = fromFormGroup.controls['stocks'].getRawValue();
    const transferStockIndex = fromStocksArrayRaw.findIndex(
      (item: any) => item._id === transferStock._id,
    );
    const toBeTransferStock = fromStocksArrayRaw.at(transferStockIndex);

    fromStocksArrayRaw.splice(transferStockIndex, 1);
    fromFormGroup.controls['checkedStocks'].patchValue([]);

    const newFromStockFormArray =
      this._convertStockArrayToArrayForm(fromStocksArrayRaw);
    fromFormGroup.setControl('stocks', newFromStockFormArray);

    const toStocksArrayRaw = toFormGroup.controls['stocks'].getRawValue();
    toStocksArrayRaw.push(toBeTransferStock);

    const newToStockFormArray =
      this._convertStockArrayToArrayForm(toStocksArrayRaw);
    toFormGroup.setControl('stocks', newToStockFormArray);

    const history: StockTransferHistory = {
      fromWarehouseId,
      toWarehouseId,
      productId: toBeTransferStock._productId,
      type: toBeTransferStock.type,
      quantity: toBeTransferStock.quantity,
      serialNumber: toBeTransferStock.serialNumber,
    };

    this._validateTransferHistory(history);
    this._refreshStockList();
  }

  private async _openTransferStockByQuantity(
    fromFormGroup: FormGroup,
    toFormGroup: FormGroup,
    dropEvent?: TransferStock,
  ) {
    const fromWarehouse = fromFormGroup.controls['warehouse'].getRawValue();
    const toWarehouse = toFormGroup.controls['warehouse'].getRawValue();
    let useStocks = fromFormGroup.controls['checkedStocks'].getRawValue();

    const afterClosed$ = this.dialog
      .open(SelectTransferQuantityComponent, {
        data: {
          stocks: dropEvent ? [dropEvent] : useStocks,
          warehouse: {
            fromWarehouse,
            toWarehouse,
          },
        },
        autoFocus: false,
        disableClose: true,
        minWidth: '75vw',
        maxWidth: '75vw',
      })
      .afterClosed();

    const stocksFromDialog = await lastValueFrom(afterClosed$);
    if (!stocksFromDialog) return;

    const fromStocksFormArr = fromFormGroup.get('stocks') as FormArray;
    const fromStocksArrRaw = fromStocksFormArr.getRawValue();
    const toStocksFormArr = toFormGroup.get('stocks') as FormArray;
    const toStocksArrRaw = toStocksFormArr.getRawValue();

    for (const toMoveStock of stocksFromDialog) {
      const fromStockIndex = fromStocksArrRaw.findIndex(
        (stock: any) => stock._id === toMoveStock._id,
      );

      if (fromStockIndex === -1) {
        console.error(toMoveStock);
        throw new Error('Stock not found');
      }

      const fromStock = fromStocksArrRaw[fromStockIndex];

      const remainingQty = fromStock.quantity - toMoveStock.quantity;
      if (remainingQty === 0) {
        fromStocksFormArr.removeAt(fromStockIndex);
      } else {
        fromStocksFormArr
          .at(fromStockIndex)
          ?.get('quantity')
          ?.setValue(remainingQty);
      }

      const toStockIndex = toStocksArrRaw.findIndex(
        (stock: any) => stock._id === toMoveStock._id,
      );

      if (toStockIndex === -1) {
        const stockFormGroup = this.fb.group({
          _id: toMoveStock['_id'],
          serialNumber: toMoveStock['serialNumber'],
          _productId: toMoveStock['_productId'],
          type: toMoveStock['type'],
          sku: toMoveStock['sku'],
          quantity: toMoveStock['quantity'],
          _warehouseId: '',
        });
        toStocksFormArr.push(stockFormGroup);
      } else {
        const existingStock = toStocksArrRaw[toStockIndex];

        toStocksFormArr
          .at(toStockIndex)
          ?.get('quantity')
          ?.setValue(existingStock.quantity + toMoveStock.quantity);
      }

      toStocksFormArr
        .at(toStockIndex)
        ?.get('_warehouseId')
        ?.setValue(toWarehouse._id);
    }

    fromFormGroup.controls['checkedStocks'].setValue([]);
    this._refreshStockList();
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

  onResetClick() {
    this.confirmation
      .open('Revert changes?', 'Do you want to revert all of your changes?')
      .afterClosed()
      .subscribe((confirmation) => {
        if (!confirmation) return;

        this._resetForms();
      });
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

    const toStocksListFormArray: any =
      this._convertStockArrayToArrayForm(toStockList);

    const stocksToBeMoved =
      fromFormGroup.controls['checkedStocks'].getRawValue();

    const excludeStockIds: string[] = [];
    for (const stock of stocksToBeMoved) {
      const history: StockTransferHistory = {
        toWarehouseId,
        fromWarehouseId,
        productId: stock._productId,
        type: stock.type,
        quantity: stock.quantity,
        serialNumber: stock.serialNumber,
      };

      const toMoveStocksFormGroup = this.fb.group({
        _id: stock._id,
        serialNumber: stock.serialNumber,
        type: stock.type,
        sku: stock.sku,
        quantity: stock.quantity,
        _productId: stock._productId,
        _warehouseId: toWarehouseId,
      });

      //TODO: Handle per quantity move
      this._validateTransferHistory(history);
      toStocksListFormArray.push(toMoveStocksFormGroup);
      excludeStockIds.push(stock._id);
    }

    toFormGroup.setControl('stocks', toStocksListFormArray);

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

  onSubmitClick() {
    const changedStocks = [
      ...this._getChangedStocksFromWhForm(this.formGroupA),
      ...this._getChangedStocksFromWhForm(this.formGroupB),
    ];

    //api call for warehouse stock transfer
  }

  private _getChangedStocksFromWhForm(formGroup: FormGroup) {
    const { stocks, immutableStockIdMap } = formGroup.getRawValue();

    const changedStocks = [];

    for (const stock of stocks) {
      const immutableStock = immutableStockIdMap[stock._id];

      if (stock.quantity !== immutableStock.quantity && stock.quantity !== 0) {
        changedStocks.push({
          ...stock,
          _id: undefined,
          sku: undefined,
        });
      }
    }

    return changedStocks;
  }

  private async _populateStocksFromSource(formGroup: FormGroup) {
    console.log('populating stocks from source');
    const warehouseId = formGroup.get('warehouse')?.value._id;

    const fetchWarehouseStocks$ = this.warehouseApi
      .getWarehouseAllStocksById(warehouseId)
      .pipe(
        map((returnObj: unknown) => {
          const response = returnObj as any;
          return response.records;
        }),
        catchError((error: any) => {
          console.error(error);
          return of([]);
        }),
      );

    const warehouseStocks = await lastValueFrom(fetchWarehouseStocks$);

    const formArray: FormArray = this._convertStockArrayToArrayForm(
      warehouseStocks as any[],
    );

    const immutableStockIdMap = formArray.getRawValue().reduce((acc, stock) => {
      acc[stock._id] = stock;
      return acc;
    }, {});

    formGroup.setControl('stocks', formArray);
    formGroup.setControl('immutableStocks', formArray);
    formGroup.addControl('immutableStockIdMap', immutableStockIdMap);
  }

  private _validateTransferHistory(newHistory: StockTransferHistory) {
    const foundStockIdHistoryIndex = this.transferHistory.findIndex(
      (history) =>
        history.productId === newHistory.productId &&
        history.fromWarehouseId === newHistory.toWarehouseId &&
        history.type === newHistory.type &&
        history.serialNumber === newHistory.serialNumber,
    );

    if (foundStockIdHistoryIndex < 0) {
      this.transferHistory.push(newHistory);
      this._setTransferHistory();
      return;
    }

    this.transferHistory.splice(foundStockIdHistoryIndex, 1);
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

  private _convertStockArrayToArrayForm(
    array: Record<string, any>[],
  ): FormArray {
    const existingIds: string[] = [];

    const formArray = new FormArray([] as any);
    for (const stock of array) {
      const id = crypto.randomUUID();

      if (existingIds.includes(id)) {
        //TODO: Handle duplicate id, show modal, refresh page
        this.snackbar.openErrorSnackbar('Please refresh the page');
        throw new Error('Warehouse Duplicate id found');
      }

      const stockFormGroup = new FormGroup({
        _id: new FormControl(id),
        serialNumber: new FormControl(stock['serialNumber']),
        _productId: new FormControl(stock['_productId']),
        type: new FormControl(stock['type']),
        sku: new FormControl(stock['sku']),
        quantity: new FormControl(stock['quantity']),
        _warehouseId: new FormControl(stock['warehouseId'] ?? ''),
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

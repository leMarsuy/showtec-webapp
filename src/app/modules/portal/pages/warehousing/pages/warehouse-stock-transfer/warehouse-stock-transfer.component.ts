import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { StockType } from '@app/core/enums/stock-type.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import {
  BehaviorSubject,
  debounceTime,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { mockObj } from './warehouse.mock';

interface StockTransferHistory {
  stockId: string;
  type: StockType;
  fromWarehouseId: string;
  toWarehouseId: string;
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

  private destroyed$ = new Subject<void>();

  warehouseList: any = Object.entries(mockObj).reduce(
    (acc: any, [key, value]: any) => {
      const useKey = key || 'no-warehouse';
      acc.push({
        id: useKey,
        name: value.name,
      });

      return acc;
    },
    [],
  );

  isBatchMove = true;

  warehouseListA$ = new BehaviorSubject<any>([]);
  warehouseListB$ = new BehaviorSubject<any>([]);
  stockListA$ = new BehaviorSubject<any>([]);
  stockListB$ = new BehaviorSubject<any>([]);

  formGroupA = this.fb.group({
    warehouse: this.fb.control({}),
    searchText: this.fb.control(''),
    stocks: this.fb.array([]),
    immutableStocks: this.fb.array([]),
  });

  formGroupB = this.fb.group({
    warehouse: this.fb.control({}),
    searchText: this.fb.control(''),
    stocks: this.fb.array([]),
    immutableStocks: this.fb.array([]),
  });

  transferHistory: StockTransferHistory[] = [];

  navigateBack() {
    //#NOTE: Change it to constant path
    this.router.navigate(['portal/warehousing']);
  }

  constructor() {
    this.formGroupA.controls['searchText'].disable();
    this.formGroupB.controls['searchText'].disable();

    this.warehouseListA$.next(this.warehouseList);
    this.warehouseListB$.next(this.warehouseList);
  }

  logFormGroupValue(formGroup: FormGroup) {
    console.log(formGroup.getRawValue());
  }

  ngOnInit(): void {
    this.formGroupA.controls['searchText']?.valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(300), startWith(''))
      .subscribe((searchText) => {
        this._filterStocks(searchText ?? '', 'A', this.formGroupA);
      });

    this.formGroupB.controls['searchText']?.valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(300), startWith(''))
      .subscribe((searchText) => {
        this._filterStocks(searchText ?? '', 'B', this.formGroupB);
      });
  }

  async warehouseChange(warehouse: any, source: 'A' | 'B') {
    const affectedWarehouseList =
      source === 'A' ? this.warehouseListB$ : this.warehouseListA$;

    const formGroup = source === 'A' ? this.formGroupA : this.formGroupB;

    affectedWarehouseList.next(
      this.warehouseList.filter((item: any) => item.id !== warehouse.id),
    );

    this._populateStocksFromResponse(formGroup);
  }

  transferStocks(from: 'A' | 'B') {
    console.log(`IF FROM is ${from}`);

    const to = from === 'A' ? 'B' : 'A';
    const fromFormGroup = from === 'A' ? this.formGroupA : this.formGroupB;
    const toFormGroup = from === 'A' ? this.formGroupB : this.formGroupA;

    const fromWarehouseRaw: any =
      fromFormGroup.controls['warehouse']?.getRawValue();

    const toWarehouseRaw: any =
      toFormGroup.controls['warehouse']?.getRawValue();

    const fromStocksRaw = fromFormGroup.controls['stocks']?.getRawValue();

    if (
      !fromStocksRaw.some((item: any) => item.checked) ||
      !toWarehouseRaw.id
    ) {
      console.log('FROM DOESNT HAVE ANY CHECKS');
      return;
    }

    const remapped: any = fromStocksRaw.reduce(
      (acc: any, curr: any, index: number) => {
        if (index === 0) {
          acc['toMove'] = [];
          acc['remains'] = [];
        }
        if (curr.checked) {
          acc['toMove'].push(curr);
        } else {
          acc['remains'].push(curr);
        }
        return acc;
      },
      {},
    );

    // FROM GROUP LIST
    const remainFormArray = new FormArray([] as any);
    console.log('BEFORE FROM FROM GROUP', fromFormGroup.getRawValue());
    if (remapped.remains.length) {
      for (const stock of remapped.remains) {
        const stockFormGroup = new FormGroup({
          _id: new FormControl(stock._id),
          serialNumber: new FormControl(stock.serialNumber),
          type: new FormControl(stock.type),
          model: new FormControl(stock.model),
          status: new FormControl(stock.status ?? 'In Stock'),
          _warehouseId: new FormControl(stock.warehouseId ?? ''),
          checked: new FormControl(false),
        });

        remainFormArray.push(stockFormGroup);
      }
    }

    fromFormGroup.setControl('stocks', remainFormArray);
    console.log('AFTER FROM FROM GROUP', fromFormGroup.getRawValue());

    // TO GROUP LIST
    const toStocksFormArray = toFormGroup.get('stocks') as FormArray;
    console.log('BEFORE TO FROM GROUP', toFormGroup.getRawValue());

    for (const stock of remapped.toMove) {
      const history: StockTransferHistory = {
        stockId: stock._id,
        type: stock.type,
        fromWarehouseId: fromWarehouseRaw?.id,
        toWarehouseId: toWarehouseRaw?.id,
      };

      const newStockGroup = new FormGroup({
        _id: new FormControl(stock._id),
        serialNumber: new FormControl(stock.serialNumber),
        type: new FormControl(stock.type),
        model: new FormControl(stock.model),
        status: new FormControl(stock.status ?? 'In Stock'),
        _warehouseId: new FormControl(
          toWarehouseRaw?.id === 'no-warehouse' ? '' : toWarehouseRaw.id,
        ),
        checked: new FormControl(false),
      });

      this._validateTransferHistory(history);
      toStocksFormArray.push(newStockGroup);
    }
    console.log('AFTER TO FROM GROUP', toFormGroup.getRawValue());

    this._filterStocks('', from, fromFormGroup);
    this._filterStocks('', to, toFormGroup);

    console.log({ history: this.transferHistory, remapped });
  }

  checkboxClick(
    change: MatCheckboxChange,
    stock: any,
    stockFormGroup: FormGroup,
  ) {
    const updateCheckValue = change.checked;

    stock.checked = updateCheckValue;
    stockFormGroup.controls['checked'].patchValue(updateCheckValue);

    console.log(stock, stockFormGroup);
  }

  private _populateStocksFromResponse(formGroup: FormGroup) {
    const warehouseId = formGroup.get('warehouse')?.value.id;
    const stocksFromReference = (mockObj as any)[warehouseId].stocks;
    const formArray = new FormArray([] as any);

    for (const stock of stocksFromReference) {
      const stockFormGroup = new FormGroup({
        _id: new FormControl(stock.id),
        serialNumber: new FormControl(stock.serialNumber),
        type: new FormControl(stock.type),
        model: new FormControl(stock.model),
        status: new FormControl(stock.status ?? 'In Stock'),
        _warehouseId: new FormControl(stock.warehouseId ?? ''),
        checked: new FormControl(false),
      });

      formArray.push(stockFormGroup);
    }

    formGroup.setControl('stocks', formArray);
    formGroup.setControl('immutableStocks', formArray);
    formGroup.controls['searchText'].enable();
  }

  private _validateTransferHistory(newHistory: StockTransferHistory) {
    const foundStockIdHistory = this.transferHistory.find(
      (history) => history.stockId === newHistory.stockId,
    );

    if (!foundStockIdHistory) {
      this.transferHistory.push(newHistory);
      return;
    }
    this.transferHistory = this.transferHistory.filter(
      (history) => history.stockId !== newHistory.stockId,
    );
  }

  private _filterStocks(
    searchText: string,
    source: 'A' | 'B',
    formGroup: FormGroup,
  ) {
    const stockList$ = source === 'A' ? this.stockListA$ : this.stockListB$;
    const stockList = formGroup.controls['stocks'].getRawValue();

    console.log(source, { stockList });

    if (!searchText) {
      stockList$.next(stockList);
      return;
    }

    const filteredStockBySearchText = stockList.filter(
      (stock: any) =>
        stock?.model.toLowerCase().includes(searchText.toLowerCase()) ||
        stock?.serialNumber.toLowerCase().includes(searchText.toLowerCase()),
    );

    stockList$.next(filteredStockBySearchText);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { StockType } from '@app/core/enums/stock-type.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import {
  debounceTime,
  lastValueFrom,
  map,
  startWith,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { TransferStock } from '../../warehouse-stock-transfer.component';
import { WarehouseStockTransferService } from '../../warehouse-stock-transfer.service';

/**
 * @param currentIndex: Index of the stock dropped data that it will be going to
 * @param previousIndex: Index of the stock dropped data that it came from
 */
export interface StockDropEventEmitted {
  currentIndex: number;
  previousIndex: number;
}

@Component({
  selector: 'app-stock-drop-list',
  templateUrl: './stock-drop-list.component.html',
  styleUrl: './stock-drop-list.component.scss',
})
export class StockDropListComponent implements OnInit, OnDestroy {
  @Input() warehouseList: any = [];
  @Input() fGroup!: FormGroup;
  @Output() onCheckedStocksChanged = new EventEmitter<any>();
  @Output() onDropStock = new EventEmitter<TransferStock>();

  private warehouseStockTransferService = inject(WarehouseStockTransferService);
  private confirmation = inject(ConfirmationService);
  private destroyed$ = new Subject<void>();

  searchControl = new FormControl('');
  filteredStocks: TransferStock[] = [];

  stockStates: Record<string, boolean> = {};

  isDraggable!: boolean;

  constructor() {
    this.searchControl.disable();

    this.warehouseStockTransferService.draggableState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((draggableState) => {
        this.isDraggable = draggableState;
      });
  }

  ngOnInit(): void {
    this.fGroup
      .get('warehouse')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        if (this.searchControl.disabled) {
          this.searchControl.enable();
        }
        this.stockStates = {};
        this.searchControl.setValue('');
      });

    this.fGroup
      .get('checkedStocks')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((checkedStocks) => {
        if (checkedStocks.length) {
          return;
        }
        this.stockStates = {};
      });

    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(400), takeUntil(this.destroyed$))
      .subscribe((searchText) => {
        this._filterStocks(searchText ?? '');
      });

    this.warehouseStockTransferService.populateStockListener$$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        const useSearchText = this.searchControl.value ?? '';
        this._filterStocks(useSearchText);
      });
  }

  logForm() {
    console.log(this.fGroup.getRawValue());
  }

  stockDrop(event: CdkDragDrop<any>) {
    const { currentIndex, previousIndex } = event;
    const transferStock = event.item.data;

    if (event.previousContainer === event.container) {
      this._reorderStocks(currentIndex, previousIndex);
    } else {
      this.onDropStock.emit(transferStock);
    }
  }

  async onWarehouseSelectClick(select: MatSelect) {
    const historyLength = this.warehouseStockTransferService.hasHistory();

    if (historyLength) {
      const afterCloseDialog$ = this.confirmation
        .open(
          'Are you sure?',
          `You have ${historyLength} unsaved changes. Do you want to discard these changes?`,
        )
        .afterClosed()
        .pipe(
          take(1),
          map((result) => !!result),
        );

      const continueSelection = await lastValueFrom(afterCloseDialog$);

      if (!continueSelection) return;
      this.warehouseStockTransferService.resetFormListener$$.next();
    }

    select.open();
  }

  onCheckboxClick(event: MatCheckboxChange, stockId: string) {
    const newState = event.checked;

    if (!this.stockStates[stockId]) {
      this.stockStates[stockId] = false;
    }

    this.stockStates[stockId] = newState;

    this._emitCheckedStocks();
  }

  private _emitCheckedStocks() {
    const stocks = this.fGroup.get('stocks')?.getRawValue();
    const checkedStocks = [];

    for (const stock of stocks) {
      if (!this.stockStates[stock._id]) {
        continue;
      }
      checkedStocks.push({ ...stock });
    }

    if (!checkedStocks.length) {
      this.onCheckedStocksChanged.emit([]);
    } else {
      this.onCheckedStocksChanged.emit(checkedStocks);
    }
  }

  private _reorderStocks(currentIndex: number, previousIndex: number) {
    const stocksFormArray = this.fGroup.controls['stocks'] as FormArray;
    const sourceFormGroup = stocksFormArray.at(previousIndex);
    const formGroups = stocksFormArray.controls;

    if (formGroups.length <= 1) {
      return;
    }

    formGroups.splice(previousIndex, 1);
    formGroups.splice(currentIndex, 0, sourceFormGroup);

    const useSearchText = this.searchControl.value ?? '';
    this._filterStocks(useSearchText);
  }

  private _filterStocks(searchText: string) {
    const stockList = this.fGroup.get('stocks')?.getRawValue();
    const sanitizedSearchText = searchText.toLowerCase();
    let useList = stockList;

    if (searchText) {
      useList = stockList.filter(
        (stock: TransferStock) =>
          stock.sku!.toLowerCase().includes(sanitizedSearchText) ||
          stock.serialNumber.toLowerCase().includes(sanitizedSearchText),
      );
    }
    this.filteredStocks = useList;
  }

  setCssClassByType(stockType: string) {
    let color = 'emerald';

    switch (stockType) {
      case StockType.DEMO:
        color = 'sky';
        break;
      case StockType.SERVICE:
        color = 'amber';
        break;
    }

    return `text-xs font-normal text-center px-2 py-1 bg-${color}-100 border border-${color}-500 rounded-full text-${color}-700 ml-1.5`;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

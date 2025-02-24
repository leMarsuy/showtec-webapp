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
import { Stock } from '@app/core/models/stock.model';
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
import { WarehouseStockTransferService } from '../../warehouse-stock-transfer.service';

@Component({
  selector: 'app-stock-drop-list',
  templateUrl: './stock-drop-list.component.html',
  styleUrl: './stock-drop-list.component.scss',
})
export class StockDropListComponent implements OnInit, OnDestroy {
  @Input() warehouseList: any = [];
  @Input() fGroup!: FormGroup;
  @Output() onCheckedStocksChanged = new EventEmitter<any>();
  @Output() onDropStock = new EventEmitter<any>();

  private warehouseStockTransferService = inject(WarehouseStockTransferService);
  private confirmation = inject(ConfirmationService);
  private destroyed$ = new Subject<void>();

  searchControl = new FormControl('');
  filteredStocks: Stock[] = [];

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
      .get('stocks')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this._filterStocks('');
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

    if (event.previousContainer === event.container) {
      this._reorderStocks(currentIndex, previousIndex);
    } else {
      const dropEmit = { currentIndex, previousIndex };
      this.onDropStock.emit(dropEmit);
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
        (stock: Stock) =>
          stock.model!.toLowerCase().includes(sanitizedSearchText) ||
          stock.serialNumber.toLowerCase().includes(sanitizedSearchText),
      );
    }
    this.filteredStocks = useList;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

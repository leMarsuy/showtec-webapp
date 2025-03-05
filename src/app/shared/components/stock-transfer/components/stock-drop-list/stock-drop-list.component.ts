import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Warehouse } from '@app/core/models/warehouse.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { WarehouseApiService } from '@app/shared/services/api/warehouse-api/warehouse-api.service';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { WarehouseStock } from '../../stock-transfer.component';
import { WarehouseStockTransferService } from '../../warehouse-stock-transfer.service';

@Component({
  selector: 'app-stock-drop-list',
  standalone: true,
  imports: [
    MatSelectModule,
    MatIconModule,
    ScrollingModule,
    DragDropModule,
    FormsModule,
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
  ],
  templateUrl: './stock-drop-list.component.html',
  styleUrl: './stock-drop-list.component.scss',
})
export class StockDropListComponent implements OnDestroy {
  @Input() warehouses!: Signal<Warehouse[]>;
  @Input() selectedWarehouse!: WritableSignal<Warehouse | undefined>;
  @Input() otherSelectedWarehouse!: WritableSignal<Warehouse | undefined>;
  @Input() warehouseName!: string;
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();

  private warehouseApiService = inject(WarehouseApiService);
  private confirmationService = inject(ConfirmationService);
  public warehouseStockTransferService = inject(WarehouseStockTransferService);

  get warehouseState(): any {
    return this.warehouseStockTransferService.warehouseState[
      this.warehouseName
    ];
  }

  set warehouseState(value: any) {
    this.warehouseStockTransferService.warehouseState[this.warehouseName] =
      value;
  }

  searchKeyword = '';

  get selectedInFilter() {
    return this.warehouseState.selected.filter((selected: string) =>
      this.warehouseState.filtered.find(
        (stock: WarehouseStock) => stock._id === selected,
      ),
    );
  }

  private _destroyed$ = new Subject<void>();
  private _subCallback = {
    next: (response: any) => {
      if (!response) {
        return;
      }

      const records = response.records.map((r: any) => {
        r._id = crypto.randomUUID();

        return r;
      });

      this.warehouseState = {
        original: records,
        immutable: JSON.parse(JSON.stringify(records)),
        selected: [],
      };

      this.warehouseState.filtered = this._filterWarehouseStocks(
        this.searchKeyword,
      );
    },
    error: (e: any) => {
      console.error(e);
    },
  };

  constructor() {
    this.warehouseStockTransferService.listChanged$
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        if (!this.selectedWarehouse()) {
          return;
        }
        this.warehouseState.filtered = this._filterWarehouseStocks(
          this.searchKeyword,
        );
      });

    this.warehouseStockTransferService.resetClicked$
      .pipe(
        takeUntil(this._destroyed$),
        switchMap(() => {
          const selectedWarehouse = this.selectedWarehouse() as Warehouse;
          if (this.selectedWarehouse()) {
            this.searchKeyword = '';
            return selectedWarehouse?._id === 'none'
              ? this.warehouseApiService.getAllStocks()
              : this.warehouseApiService.getWarehouseAllStocksById(
                  selectedWarehouse._id,
                );
          }
          return EMPTY;
        }),
      )
      .subscribe(this._subCallback);
  }

  unselectWarehouseClick(selectRef: MatSelect) {
    const unselectWarehouse = () => {
      this.selectedWarehouse.set(undefined);
      selectRef.options.forEach((option) => {
        option.deselect();
      });

      this.warehouseStockTransferService.changedStocks = [];
      this.warehouseStockTransferService.resetClicked$.next();

      setTimeout(() => {
        selectRef.open();
      });
    };

    if (this.warehouseStockTransferService.changedStocks.length) {
      this.confirmationService
        .open(
          'Change Warehouse',
          'Are you sure you want to change warehouse and discard all of your changes?',
        )
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            unselectWarehouse();
          }
        });
    } else {
      unselectWarehouse();
    }
  }

  onResetSearchKeywordClick() {
    this.searchKeyword = '';
    this.searchKeywordChange('');
  }

  onWarehouseChange(warehouse: Warehouse) {
    if (!warehouse) {
      this.warehouseState = {
        original: [],
        filtered: [],
        selected: [],
      };
      return;
    }

    const apiCall =
      warehouse._id === 'none'
        ? this.warehouseApiService.getAllStocks()
        : this.warehouseApiService.getWarehouseAllStocksById(warehouse._id);

    apiCall.subscribe(this._subCallback);
  }

  onCheckboxClick(event: MatCheckboxChange, stockId: string) {
    if (event.checked) {
      this.warehouseState.selected.push(stockId);
    } else {
      const selectedIndex = this.warehouseState.selected.indexOf(stockId);
      this.warehouseState.selected.splice(selectedIndex, 1);
    }
  }

  searchKeywordChange(keyword: string) {
    if (!keyword) {
      this.warehouseState.filtered = [...this.warehouseState.original];
      return;
    }

    this.warehouseState.filtered = this._filterWarehouseStocks(keyword);
  }

  drop(event: CdkDragDrop<string[]>) {
    this.dropEvent.emit(event);
  }

  trackById(index: number, item: any) {
    return item._id;
  }

  selectAllClick() {
    const newSelected = this.warehouseState.filtered.map(
      (stock: WarehouseStock) => stock._id,
    );

    this.warehouseState.selected = [
      ...new Set([...this.warehouseState.selected, ...newSelected]),
    ];
  }

  deselectAllClick() {
    const toDeselect = this.warehouseState.filtered.map(
      (stock: WarehouseStock) => stock._id,
    );

    this.warehouseState.selected = this.warehouseState.selected.filter(
      (selected: string) => !toDeselect.includes(selected),
    );
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private _filterWarehouseStocks(keyword: string) {
    const newKeyword = keyword.trim().toLowerCase();
    return this.warehouseState.original.filter((stock: any) => {
      return (
        stock?.sku?.trim()?.toLowerCase()?.includes(newKeyword) ||
        stock?.serialNumber?.trim()?.toLowerCase()?.includes(newKeyword)
      );
    });
  }
}

import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Warehouse } from '@app/core/models/warehouse.model';
import { WarehouseApiService } from '@app/shared/services/api/warehouse-api/warehouse-api.service';
import { filter, switchMap } from 'rxjs';
import { ConfirmationService } from '../confirmation/confirmation.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { SelectTransferQuantityComponent } from './components/select-transfer-quantity/select-transfer-quantity.component';
import { StockDropListComponent } from './components/stock-drop-list/stock-drop-list.component';
import { WarehouseStockTransferService } from './warehouse-stock-transfer.service';

export interface WarehouseStock {
  _id: string;
  serialNumber: string;
  type: string;
  sku: string;
  _productId: string;
  _warehouseId: string;
  quantity: number;
  _stockIds: string[];
}

@Component({
  selector: 'app-stock-transfer',
  standalone: true,
  imports: [
    StockDropListComponent,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    DragDropModule,
  ],
  templateUrl: './stock-transfer.component.html',
  styleUrl: './stock-transfer.component.scss',
})
export class StockTransferComponent {
  private warehouseApiService = inject(WarehouseApiService);
  private warehouseStockTransferService = inject(WarehouseStockTransferService);
  private confirmationService = inject(ConfirmationService);
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);

  get warehouseBState() {
    return this.warehouseStockTransferService.warehouseBState;
  }

  get warehouseAState() {
    return this.warehouseStockTransferService.warehouseAState;
  }

  get changedStocks() {
    return this.warehouseStockTransferService.changedStocks;
  }

  isBatchMove = true;

  warehouses = signal<Warehouse[]>([]);
  selectedWarehouseA = signal<Warehouse | undefined>(undefined);
  selectedWarehouseB = signal<Warehouse | undefined>(undefined);
  isSubmitting = false;

  constructor() {
    this.warehouseApiService.getWarehouses().subscribe({
      next: (response) => {
        response.records.unshift({
          _id: 'none',
          name: 'NO WAREHOUSE',
        } as Warehouse);

        this.warehouses.set(response.records);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  onTransferWarehouseStock(
    event: CdkDragDrop<any>,
    destinationWarehouseName: string,
  ) {
    const destinationWarehouseState =
      this.warehouseStockTransferService.warehouseState[
        destinationWarehouseName
      ];
    const sourceWarehouseName = destinationWarehouseName === 'A' ? 'B' : 'A';
    const sourceWarehouseState =
      this.warehouseStockTransferService.warehouseState[sourceWarehouseName];

    const records = destinationWarehouseState.original;
    if (event.previousContainer === event.container) {
      const element = records[event.previousIndex];
      records.splice(event.previousIndex, 1);
      records.splice(event.currentIndex, 0, element);
      this.warehouseStockTransferService.listChange();
    } else {
      const element = sourceWarehouseState.original[event.previousIndex];
      const immediateTransfer = element.quantity === 1;

      if (this.isBatchMove || immediateTransfer) {
        this._transferStocks(destinationWarehouseName, {
          previousIndex: event.previousIndex,
          currentIndex: event.currentIndex,
        });
      } else {
        const { sourceWarehouse, destinationWarehouse } =
          this._getSourceDestWarehouse(sourceWarehouseName);

        this._openSelectTransferQuantityDialog(
          sourceWarehouse,
          destinationWarehouse,
          [element],
        )
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this._transferOrSplitStock(
                sourceWarehouseName,
                destinationWarehouseName,
                result,
              );

              this.warehouseStockTransferService.setChangedStocks();
            }
          });
      }

      if (sourceWarehouseState.selected.includes(element._id) !== -1) {
        const elementIndex = sourceWarehouseState.selected.indexOf(element._id);
        sourceWarehouseState.selected.splice(elementIndex, 1);
      }

      this.warehouseStockTransferService.setChangedStocks();
    }
  }

  moveButtonClick(
    soureWarehouseName: string,
    destinationWarehouseName: string,
  ) {
    const sourceWarehouseState =
      this.warehouseStockTransferService.warehouseState[soureWarehouseName];
    const immediateTransfer = sourceWarehouseState.selected.every(
      (stockId: string) =>
        sourceWarehouseState.original.find(
          (stock: WarehouseStock) => stock._id === stockId,
        ).quantity === 1,
    );

    if (this.isBatchMove || immediateTransfer) {
      this._transferWarehouseStock(
        soureWarehouseName,
        destinationWarehouseName,
      );
      this.warehouseStockTransferService.setChangedStocks();
    } else {
      const { sourceWarehouse, destinationWarehouse } =
        this._getSourceDestWarehouse(soureWarehouseName);

      const stocks = sourceWarehouseState.original.filter(
        (stock: WarehouseStock) =>
          sourceWarehouseState.selected.includes(stock._id),
      );

      this._openSelectTransferQuantityDialog(
        sourceWarehouse,
        destinationWarehouse,
        stocks,
      )
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this._transferOrSplitStock(
              soureWarehouseName,
              destinationWarehouseName,
              result,
            );

            this.warehouseStockTransferService.setChangedStocks();
          }
        });
    }
  }

  onResetClick() {
    this.confirmationService
      .open('Revert changes', 'Do you want to revert all of your changes?')
      .afterClosed()
      .subscribe((confirmation) => {
        if (!confirmation) return;
        this.warehouseStockTransferService.changedStocks = [];
        this.warehouseStockTransferService.resetClick();
      });
  }

  onSubmitClick() {
    this.confirmationService
      .open(
        'Stock Transfer Confirmation',
        'Do you want to proceed with the stock transfer?',
      )
      .afterClosed()
      .pipe(
        filter((confirmation) => confirmation),
        switchMap(() => {
          this.isSubmitting = true;
          return this.warehouseApiService.transferStocksWarehouse(
            this.changedStocks,
          );
        }),
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.warehouseStockTransferService.changedStocks = [];
          this.warehouseStockTransferService.resetClick();
          this.snackbarService.openSuccessSnackbar('Stocks transferred');
        },
        error: (e) => {
          this.isSubmitting = false;
          console.error(e);
          this.snackbarService.openErrorSnackbar('Failed to transfer stocks');
        },
      });
  }

  private _openSelectTransferQuantityDialog(
    sourceWarehouse: Warehouse,
    destinationWarehouse: Warehouse,
    stocks: any,
  ) {
    return this.dialog.open(SelectTransferQuantityComponent, {
      data: {
        sourceWarehouse,
        destinationWarehouse,
        stocks,
      },
      autoFocus: false,
      disableClose: true,
      minWidth: '75vw',
      maxWidth: '75vw',
    });
  }

  private _transferOrSplitStock(
    sourceWarehouseName: string,
    destinationWarehouseName: string,
    toTranferStocks: WarehouseStock[],
  ) {
    const sourceWarehouseState =
      this.warehouseStockTransferService.warehouseState[sourceWarehouseName];

    for (const stock of toTranferStocks) {
      const stockIndex = sourceWarehouseState.original.findIndex(
        (s: WarehouseStock) => stock._id === s._id,
      );
      const sourceStock = sourceWarehouseState.original[stockIndex];

      const remainingQty = sourceStock.quantity - stock.quantity;
      const stockAttr: any = {
        quantity: stock.quantity,
      };

      if (remainingQty > 0) {
        const transferStockIds = sourceStock._stockIds.splice(
          0,
          stock.quantity,
        );

        stockAttr._stockIds = transferStockIds;
      } else {
        stockAttr._stockIds = stock._stockIds;
      }

      this._transferStocks(
        destinationWarehouseName,
        {
          previousIndex: stockIndex,
          currentIndex: 0,
        },
        stockAttr,
      );
    }

    sourceWarehouseState.selected = [];

    this.warehouseStockTransferService.listChange();
  }

  private _transferWarehouseStock(
    sourceWarehouseName: string,
    destinationWarehouseName: string,
  ) {
    const sourceWarehouseState =
      this.warehouseStockTransferService.warehouseState[sourceWarehouseName];

    for (const warehouseStockId of sourceWarehouseState.selected) {
      const stockIndex = sourceWarehouseState.original.findIndex(
        (stock: WarehouseStock) => warehouseStockId === stock._id,
      );

      this._transferStocks(destinationWarehouseName, {
        previousIndex: stockIndex,
        currentIndex: 0,
      });
    }

    sourceWarehouseState.selected = [];
  }

  private _transferStocks(
    destinationWarehouseName: string,
    event: {
      previousIndex: number;
      currentIndex: number;
    },
    stockAttr?: any,
  ) {
    const sourceWarehouseName = destinationWarehouseName === 'A' ? 'B' : 'A';

    const sourceWarehouseState =
      this.warehouseStockTransferService.warehouseState[sourceWarehouseName];

    const destinationWarehouseState =
      this.warehouseStockTransferService.warehouseState[
        destinationWarehouseName
      ];

    const { destinationWarehouse } =
      this._getSourceDestWarehouse(sourceWarehouseName);

    const sourceRecords = sourceWarehouseState.original;
    const destinationRecords = destinationWarehouseState.original;

    const element = sourceRecords[event.previousIndex];
    const identicalStock = destinationRecords.find(
      (stock: WarehouseStock) =>
        stock._id === element._id ||
        (stock.serialNumber === element.serialNumber &&
          stock._productId === element._productId &&
          stock.type === element.type),
    );

    if (identicalStock) {
      if (stockAttr) {
        identicalStock.quantity += stockAttr.quantity;
        identicalStock._stockIds.push(...stockAttr._stockIds);
      } else {
        identicalStock.quantity += element.quantity;
        identicalStock._stockIds.push(...element._stockIds);
      }
    } else {
      destinationRecords.splice(event.currentIndex, 0, {
        ...element,
        ...(stockAttr || {}),
        _warehouseId: destinationWarehouse._id,
      });
    }

    if (stockAttr) {
      element.quantity = element.quantity - stockAttr.quantity;
    } else {
      element.quantity = 0;
    }

    if (element.quantity === 0) {
      sourceRecords.splice(event.previousIndex, 1);
    }

    this.warehouseStockTransferService.listChange();
  }

  private _getSourceDestWarehouse(sourceWarehouseName: string) {
    const isSourceWarehouseA = sourceWarehouseName === 'A';
    return {
      sourceWarehouse: isSourceWarehouseA
        ? (this.selectedWarehouseA() as Warehouse)
        : (this.selectedWarehouseB() as Warehouse),
      destinationWarehouse: isSourceWarehouseA
        ? (this.selectedWarehouseB() as Warehouse)
        : (this.selectedWarehouseA() as Warehouse),
    };
  }
}

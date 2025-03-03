import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { WarehouseStockHistory } from '@app/core/models/warehouse-stock-history';
import { Warehouse } from '@app/core/models/warehouse.model';
import { WarehouseApiService } from '@app/shared/services/api/warehouse-api/warehouse-api.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { TableModule } from '../table/table.module';
import { WAREHOUSE_STOCK_HISTORY_CONFIG } from './warehoust-stock-history-dialog.config';

@Component({
  selector: 'app-warehouse-stock-history-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    TableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './warehouse-stock-history-dialog.component.html',
  styleUrl: './warehouse-stock-history-dialog.component.scss',
})
export class WarehouseStockHistoryDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<WarehouseStockHistoryDialogComponent>,
  );
  private readonly warehouseApiService = inject(WarehouseApiService);
  private snackbarService = inject(SnackbarService);
  private readonly formBuilder = inject(FormBuilder);

  dataSource: WarehouseStockHistory[] = [];
  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };
  isLoading = true;
  columns = WAREHOUSE_STOCK_HISTORY_CONFIG.tableColumns;
  warehouses: Warehouse[] = [];

  formGroup = this.formBuilder.group({
    _fromWarehouseId: [''],
    _toWarehouseId: [''],
    search: [''],
  });

  constructor() {
    this._fetchData();
    this._fetchWarehouses();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  rowClick(event: any) {}

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    this._fetchData();
  }

  searchClick() {
    this._fetchData();
  }

  warehouseFilterchange() {
    this._fetchData();
  }

  private _setLoadingState(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  private _fetchData() {
    this._setLoadingState(true);

    const query: any = {
      pageIndex: this.page.pageIndex,
      pageSize: this.page.pageSize,
    };

    const { search, _fromWarehouseId, _toWarehouseId } =
      this.formGroup.getRawValue();

    if (search) {
      query.search = search;
    }

    if (_fromWarehouseId) {
      query._fromWarehouseId = _fromWarehouseId;
    }

    if (_toWarehouseId) {
      query._toWarehouseId = _toWarehouseId;
    }

    this.warehouseApiService.getWarehouseStockHistories(query).subscribe({
      next: (response) => {
        this.dataSource = response.records;
        this.page.length = response.total;
        this._setLoadingState(false);
      },
      error: (e) => {
        console.error(e);
        this.snackbarService.openErrorSnackbar('Failed to fetch stock history');
        this._setLoadingState(false);
      },
    });
  }

  private _fetchWarehouses() {
    this.warehouseApiService.getWarehouses().subscribe({
      next: (response) => {
        const otherOpts = [
          {
            name: 'ALL',
            _id: 'all',
          },
          {
            name: 'NO WAREHOUSE',
            _id: 'no-warehouse',
          },
        ] as Warehouse[];

        response.records.unshift(...otherOpts);

        this.warehouses = response.records;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }
}

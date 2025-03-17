import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STOCK_TYPES, StockType } from '@app/core/enums/stock-type.enum';
import { HttpGetResponse } from '@core/interfaces/http-get-response.interface';
import { Stock } from '@core/models/stock.model';
import { Supplier } from '@core/models/supplier.model';
import { Warehouse } from '@core/models/warehouse.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { SupplierApiService } from '@shared/services/api/supplier-api/supplier-api.service';
import { WarehouseApiService } from '@shared/services/api/warehouse-api/warehouse-api.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-update-stock',
  providers: [provideNativeDateAdapter()],
  templateUrl: './update-stock.component.html',
  styleUrl: './update-stock.component.scss',
})
export class UpdateStockComponent implements AfterViewInit {
  warehouses: Warehouse[] = [];
  suppliers: Supplier[] = [];

  allowDuplicates = false;
  loading = false;

  filteredWarehouses!: Observable<Warehouse[]>;
  filteredSuppliers!: Observable<Supplier[]>;

  stockForm = this.fb.group({
    serialNumber: this.fb.control('', [Validators.required]),
    scanDate: this.fb.control(new Date()),
  });

  stockDetailsForm = this.fb.group({
    purchaseDate: this.fb.control(null),
    purchaseCost: this.fb.control(null),
    _warehouseId: this.fb.control(null),
    _supplierId: this.fb.control(null),
    remarks: this.fb.control(null),
  });

  scannedStocks: Stock[] = [];
  isStockTypeEditing: any = {};
  STOCK_TYPE_OPTIONS = STOCK_TYPES;

  @ViewChild('serialNumber') serialNumber!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getWarehouses();
      this.getSuppliers();
    }, 5);

    this.filteredWarehouses = this.warehouseControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', [...this.warehouses])),
    );

    this.filteredSuppliers = this.supplierControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', [...this.suppliers])),
    );
  }

  get warehouseControl() {
    return this.stockDetailsForm.get('_warehouseId') as FormControl;
  }

  get supplierControl() {
    return this.stockDetailsForm.get('_supplierId') as FormControl;
  }

  get isFormValid() {
    const hasStockOpenedChecker = Object.values(this.isStockTypeEditing).every(
      (result) => result === false,
    );

    return !this.scannedStocks.length || this.loading || !hasStockOpenedChecker;
  }

  private _filter(value: any, arr: Array<Warehouse | Supplier>): any {
    const filterValue = (value.name || value || '').toUpperCase();
    return arr.filter((item) => item.name.includes(filterValue));
  }

  constructor(
    private fb: FormBuilder,
    private productApi: ProductApiService,
    private warehouseApi: WarehouseApiService,
    private supplierApi: SupplierApiService,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string; name: string },
    private dialogRef: MatDialogRef<UpdateStockComponent>,
    private snackBarService: SnackbarService,
  ) {}

  addStock() {
    this.stockForm.get('scanDate')?.setValue(new Date());
    var stock = this.stockForm.getRawValue() as Stock;

    if (
      this.allowDuplicates ||
      !this.scannedStocks.find(
        (o) => o.serialNumber.trim() == stock.serialNumber.trim(),
      )
    ) {
      this.scannedStocks.unshift({ ...stock, type: StockType.SEALED });
    }

    this.stockForm.reset();
    this.focusToSerialNumber();
  }

  removeStock(i: number) {
    this.scannedStocks.splice(i, 1);
    this.focusToSerialNumber();
  }

  focusToSerialNumber() {
    this.serialNumber.nativeElement.focus();
  }

  stockToProduct() {
    this.loading = true;

    const payload = this.stocks.map((stock: any) => {
      return {
        ...stock,
        _supplierId: stock._supplierId?._id || undefined,
        _warehouseId: stock._warehouseId?._id || undefined,
      };
    });

    this.productApi
      .stockToProduct(this.data._id, payload, this.allowDuplicates)
      .subscribe({
        next: (res) => {
          this.snackBarService.openSuccessSnackbar(
            'Stock Success',
            `Successfully Stocked ${this.scannedStocks.length} New Items.`,
          );
          this.dialogRef.close(true);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.snackBarService.openErrorSnackbar(
            err.error.errorCode,
            err.error.message,
          );
        },
      });
  }

  openTypeSelection(stock: Stock, index: number) {
    const stockTypeKey = `${stock.serialNumber}_${index}`;
    if (!this.isStockTypeEditing[stockTypeKey]) {
      this.isStockTypeEditing[stockTypeKey] = false;
    }

    this.isStockTypeEditing[stockTypeKey] =
      !this.isStockTypeEditing[stockTypeKey];
  }

  onStockTypeChange(stock: Stock, index: number, selectEl: HTMLSelectElement) {
    const selectedType = selectEl.value;
    const stockTypeKey = `${stock.serialNumber}_${index}`;

    stock.type = selectedType as StockType;
    this.isStockTypeEditing[stockTypeKey] = false;
  }

  get stocks(): Stock[] {
    var stocks: Stock[] = [];
    var stockDetails = this.stockDetailsForm.getRawValue();
    this.scannedStocks.forEach((stock) => {
      stock.purchaseDate = stockDetails.purchaseDate || undefined;
      stock.purchaseCost = stockDetails.purchaseCost || 0;
      stock._warehouseId = stockDetails._warehouseId || undefined;
      stock._supplierId = stockDetails._supplierId || undefined;
      stock.remarks = (stockDetails.remarks || '-') + '';
      stocks.push({ ...stock });
    });
    return stocks;
  }

  getWarehouses() {
    this.warehouseControl.disable();
    this.warehouseApi.getWarehouses().subscribe({
      next: (res) => {
        var response = res as HttpGetResponse;
        this.warehouses = response.records as Array<Warehouse>;
        this.warehouseControl.enable();
      },
    });
  }

  getSuppliers() {
    this.supplierControl.disable();
    this.supplierApi.getSuppliers().subscribe({
      next: (res) => {
        var response = res as HttpGetResponse;
        this.suppliers = response.records as Array<Supplier>;
        this.supplierControl.enable();
      },
    });
  }

  displayWarehouse(warehouse: Warehouse): string {
    return warehouse.name;
  }

  displaySupplier(supplier: Supplier): string {
    return supplier.name;
  }
}

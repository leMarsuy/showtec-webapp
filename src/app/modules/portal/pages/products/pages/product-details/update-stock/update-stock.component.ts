import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { Stock } from '@core/models/stock.model';
import { WarehouseApiService } from '@shared/services/api/warehouse-api/warehouse-api.service';
import { SupplierApiService } from '@shared/services/api/supplier-api/supplier-api.service';
import { Warehouse } from '@core/models/warehouse.model';
import { Supplier } from '@core/models/supplier.model';
import { map, Observable, startWith } from 'rxjs';
import { HttpGetResponse } from '@core/interfaces/http-get-response.interface';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StockType } from '@app/core/enums/stock-type.enum';

@Component({
  selector: 'app-update-stock',
  providers: [provideNativeDateAdapter()],
  templateUrl: './update-stock.component.html',
  styleUrl: './update-stock.component.scss',
})
export class UpdateStockComponent implements AfterViewInit {
  warehouses: Warehouse[] = [];
  suppliers: Supplier[] = [];

  filteredWarehouses!: Observable<Warehouse[]>;
  filteredSuppliers!: Observable<Supplier[]>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getWarehouses();
      this.getSuppliers();
    }, 5);

    this.filteredWarehouses = this.warehouseControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', [...this.warehouses]))
    );

    this.filteredSuppliers = this.supplierControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', [...this.suppliers]))
    );
  }

  get warehouseControl() {
    return this.stockDetailsForm.get('_warehouseId') as FormControl;
  }

  get supplierControl() {
    return this.stockDetailsForm.get('_supplierId') as FormControl;
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
    private snackBarService: SnackbarService
  ) {}

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

  addStock() {
    this.stockForm.get('scanDate')?.setValue(new Date());
    var stock = this.stockForm.getRawValue() as Stock;
    if (!stock.serialNumber.trim()) var { serialNumber } = stock;
    if (!this.scannedStocks.find((o) => o.serialNumber === serialNumber)) {
      this.scannedStocks.unshift({ ...stock, type: StockType.SEALED });
    }
    this.stockForm.get('serialNumber')?.reset();
  }

  removeStock(i: number) {
    this.scannedStocks.splice(i, 1);
  }

  stockToProduct() {
    this.productApi.stockToProduct(this.data._id, this.stocks).subscribe({
      next: (res) => {
        this.snackBarService.openErrorSnackbar(
          'Stock Success',
          `Successfully Stocked ${this.scannedStocks.length} New Items.`
        );
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  get stocks(): Stock[] {
    var stocks: Stock[] = [];
    var stockDetails = this.stockDetailsForm.getRawValue();
    console.log(stockDetails);
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

  displayFn(_id: string): string {
    // if (!_id)
    return _id;
    // var entity =
    //   this.suppliers.find((o) => o._id == _id) ||
    //   this.warehouses.find((o) => o._id == _id);
    // return entity?.name || '';
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Product } from '@app/core/models/product.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';
import { ExcelService } from '@app/shared/services/excel/excel.service';
import * as XLSX from 'xlsx';
const BATCH_SIZE = 20;

const productTemplate = [
  {
    SKU: 'SKU Sample',
    Brand: 'Brand Sample',
    Model: 'Model Sample',
    Classification: 'Classification Sample',
    Description: 'Description Sample',
    Price: 1000,
  },
];

@Component({
  selector: 'app-batch-add-product',
  templateUrl: './batch-add-product.component.html',
  styleUrl: './batch-add-product.component.scss',
})
export class BatchAddProductComponent {
  products: Product[] = [];
  page: PageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 30,
  };
  progress = 0;
  uploading = false;
  columns: TableColumn[] = [
    {
      label: 'SKU',
      dotNotationPath: 'sku',
      type: ColumnType.STRING,
    },
    {
      label: 'Brand',
      dotNotationPath: 'brand',
      type: ColumnType.STRING,
    },
    {
      label: 'Model',
      dotNotationPath: 'model',
      type: ColumnType.STRING,
    },
    {
      label: 'Classification',
      dotNotationPath: 'classification',
      type: ColumnType.STRING,
    },
    {
      label: 'Description',
      dotNotationPath: 'description',
      type: ColumnType.STRING,
    },
    {
      label: 'Price',
      dotNotationPath: 'price.amount',
      type: ColumnType.NUMBER,
    },
  ];

  showTable = false;

  constructor(
    private excel: ExcelService,
    private productApi: ProductApiService,
    private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<BatchAddProductComponent>,
  ) {}

  props = {
    allowedExtensions: ['xlsx'],
    label: 'List of Products',
  };

  fileUploaded(file: File) {
    this._readFile(file);
  }

  _readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      let data = evt.target.result;
      let workbook = XLSX.read(data, {
        type: 'binary',
        cellDates: true,
      });
      let worksheet = workbook.Sheets[workbook.SheetNames[0]];
      this.products = this.excel.excel2json(worksheet).map(
        (row) =>
          ({
            sku: row['SKU'] + '',
            brand: row['Brand'] + '',
            model: row['Model'] + '',
            classification: row['Classification'] + '',
            description: row['Description'] + '',
            price: {
              amount: row['Price'],
              currency: 'PHP',
            },
          }) as Product,
      );

      this.showTable = true;
      this.page.length = this.products.length;
      this.page.pageSize = this.products.length;
    };
    reader.readAsArrayBuffer(file);
  }

  downloadTemplate() {
    this.excel.download('Batch Product Upload Template', productTemplate);
  }

  batching() {
    this.uploading = true;
    var products = this.products.splice(0, BATCH_SIZE);
    this.createProductByBatch(products);
  }

  createProductByBatch(products: Array<Product>) {
    this.productApi.createProductByBatch(products).subscribe({
      next: (response) => {
        this.progress += products.length;
        this.products = [...this.products];
        if (this.products.length) {
          this.batching();
        } else {
          this.snackbar.openSuccessSnackbar(
            'BatchInsertSuccess',
            'Products Successfully Inserted to List.',
          );
          this.dialogRef.close(true);
          this.uploading = false;
          this.progress = 0;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.openErrorSnackbar(err.error.errorCode, err.error.message);
      },
    });
  }
}

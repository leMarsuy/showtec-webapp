import { Component } from '@angular/core';
import { Product } from '@app/core/models/product.model';
import { ExcelService } from '@app/shared/services/excel/excel.service';
import * as XLSX from 'xlsx';

var productTemplate = [
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

  constructor(private excel: ExcelService) {}

  props = {
    allowedExtensions: ['xlsx'],
    label: 'List of Products',
  };

  fileUploaded(file: File) {
    const reader = new FileReader();
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
      this.products = this.excel.excel2json(worksheet);
      console.log(this.products);
    };
    reader.readAsArrayBuffer(file);
  }

  downloadTemplate() {
    this.excel.download('Batch Product Upload Template', productTemplate);
  }
}

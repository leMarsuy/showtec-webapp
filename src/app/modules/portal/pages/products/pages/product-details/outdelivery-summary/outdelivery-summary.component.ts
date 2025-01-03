import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { Stock } from '@app/core/models/stock.model';

interface OutDeliverySummary {
  outdelivery: OutDelivery;
  stock: Stock;
}

@Component({
  selector: 'app-outdelivery-summary',
  templateUrl: './outdelivery-summary.component.html',
  styleUrl: './outdelivery-summary.component.scss',
})
export class OutdeliverySummaryComponent {
  outdelivery!: OutDelivery;
  stock!: Stock;

  tableColumns = [
    {
      label: 'Brand',
      dotNotation: 'STATIC.brand',
    },
    {
      label: 'Classification',
      dotNotation: 'STATIC.classification',
    },
    {
      label: 'Model',
      dotNotation: 'STATIC.model',
    },
    {
      label: 'Serial No.',
      dotNotation: 'STATIC.serialNumber',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OutDeliverySummary,
    public dialogRef: MatDialogRef<OutdeliverySummaryComponent>,
  ) {
    this.outdelivery = this.data.outdelivery;
    this.stock = this.data.stock;
  }
}

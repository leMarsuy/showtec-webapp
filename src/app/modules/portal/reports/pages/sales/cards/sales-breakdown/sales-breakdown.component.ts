import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-breakdown',
  templateUrl: './sales-breakdown.component.html',
  styleUrl: './sales-breakdown.component.scss',
})
export class SalesBreakdownComponent implements OnInit {
  @Input() data: Array<any> = [];

  options: any = {
    series: [],
    chart: {
      type: 'donut',
    },
    labels: [],
  };

  constructor() {}

  ngOnInit(): void {
    this.data.forEach((val) => {
      this.options.series.push(val.saleAmount);
      this.options.labels.push(val._id);
    });
  }
}

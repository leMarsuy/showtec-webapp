import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrl: './daily-sales.component.scss',
})
export class DailySalesComponent implements OnInit {
  @Input() data: Array<any> = [];

  options: any = {
    series: [
      {
        name: 'Sales',
        data: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 238,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        borderRadius: 7,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: '₱ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return '₱ ' + val;
        },
      },
    },
  };

  ngOnInit(): void {
    this.data.forEach((val) => {
      this.options.series[0].data.push(val.sales);
      this.options.xaxis.categories.push(val.date);
    });
  }
}

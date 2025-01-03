import { Component, Input, OnInit } from '@angular/core';
import { getDateFloor, getPastDate } from '@app/shared/utils/dateUtil';
import { toComma } from '@app/shared/utils/numberUtil';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrl: './daily-sales.component.scss',
})
export class DailySalesComponent implements OnInit {
  @Input() data: Array<any> = [];
  @Input() pastDays: number = 0;

  options: any = {
    series: [
      {
        name: 'Sales',
        data: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 300,
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
        text: 'Sales',
      },
      labels: {
        formatter: function (val: number) {
          return toComma(Math.round(val));
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return '₱ ' + toComma(val);
        },
      },
    },
  };

  ngOnInit(): void {
    this.populateLabelWithDates();
    // this.data.forEach((val) => {
    //   var date = new Date(val.date);
    //   var month = date.getMonth() + 1;
    //   var label =
    //     month + '/' + date.getDate() + '/' + (date.getFullYear() - 2000);
    //   this.options.series[0].data.push(val.sales);
    //   this.options.xaxis.categories.push(label);
    // });
  }

  populateLabelWithDates() {
    var today = new Date();
    var startDate = getDateFloor(getPastDate(new Date(today), this.pastDays));

    while (startDate < today) {
      var label =
        startDate.getMonth() +
        1 +
        '/' +
        startDate.getDate() +
        '/' +
        (startDate.getFullYear() - 2000);

      var value = this.data.find(
        (o) => new Date(o.date).getDate() === new Date(startDate).getDate(),
      );

      this.options.xaxis.categories.push(label);
      this.options.series[0].data.push(value?.sales || 0);
      startDate.setDate(startDate.getDate() + 1);
    }
  }
}

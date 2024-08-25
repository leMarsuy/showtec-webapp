import { Component } from '@angular/core';
import { SalesAnalyticsService } from '@app/shared/services/analytics/sales-analytics/sales-analytics.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  dateFrom = new Date('01/01/2024');
  dateTo = new Date();

  salesReport: any;

  constructor(saleAnalytics: SalesAnalyticsService) {
    saleAnalytics.salesReports(this.dateFrom, this.dateTo).subscribe({
      next: (data: any) => {
        this.salesReport = data;
        console.log(this.salesReport);
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { SalesAnalyticsService } from '@app/shared/services/analytics/sales-analytics/sales-analytics.service';
import { getDateDiffInDays, getPastDate } from '@app/shared/utils/dateUtil';
import { enviroment } from '@env/environment';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent implements OnInit {
  pastDays = 25;
  diffDaysFromProjectStart = getDateDiffInDays(
    enviroment.projectStart,
    new Date()
  );
  dateFrom = getPastDate(new Date(), this.pastDays);
  dateTo = new Date();

  salesReport: any;

  constructor(
    public saleAnalytics: SalesAnalyticsService,
    public sb: SnackbarService
  ) {
    sb.openLoadingSnackbar(
      'Sales Analytics',
      'Aggregating data from records...'
    );
    this.fetchSalesReport();
  }

  ngOnInit(): void {
    if (this.diffDaysFromProjectStart < this.pastDays) {
      this.pastDays = this.diffDaysFromProjectStart;
    }
  }

  fetchSalesReport() {
    this.saleAnalytics.salesReports(this.dateFrom, this.dateTo).subscribe({
      next: (data: any) => {
        this.salesReport = data;
        console.log(this.salesReport);
        this.sb.closeLoadingSnackbar();
      },
      error: (error: any) => {
        this.sb.openErrorSnackbar(error.error.errorCode, error.error.message);
      },
    });
  }
}

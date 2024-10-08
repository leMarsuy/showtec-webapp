import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class SalesAnalyticsService {
  apiUrl = environment.API_URL;
  apiPrefix = 'analytics';

  constructor(private httpService: HttpService) {}

  salesReports(dateFrom: Date, dateTo: Date) {
    return this.httpService.get(`${this.apiPrefix}/sales-reports`, {
      dateFrom,
      dateTo,
    });
  }

  getTransactions(dateFrom: Date, dateTo: Date) {
    return this.httpService.get(`${this.apiPrefix}/transactions`, {
      dateFrom,
      dateTo,
    });
  }
}

import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '../../http/http.service';
import { UtilService } from '../../util/util.service';
import { QueryParams } from '@app/core/interfaces/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionApiService {
  private readonly apiPrefix = 'transactions';
  private readonly httpService = inject(HttpService);
  private readonly utilService = inject(UtilService);

  getTransactions(query?: QueryParams) {
    let sanitizedQuery: any = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort ?? '',
        searchText: query.searchText ?? '',
        status: query.status ?? '',
      };

      if (query?.date) {
        const date = this.utilService.date.dateToQueryParam(query.date);
        sanitizedQuery = { ...sanitizedQuery, date };
      }
    }

    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }
}

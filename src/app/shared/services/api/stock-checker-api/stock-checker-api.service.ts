import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { QueryParams } from '@app/core/interfaces/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class StockCheckerApiService {
  private readonly apiPrefix = 'stock-checker';

  constructor(private httpService: HttpService) {}

  getProducts(query?: QueryParams & { classifications?: string }) {
    let sanitizedQuery: QueryParams & { classifications?: string } = {};

    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort ?? '',
        searchText: query.searchText ?? '',
        classifications: query.classifications ?? '',
      };
    }

    return this.httpService.get(`${this.apiPrefix}/products`, sanitizedQuery);
  }
}

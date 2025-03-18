import { Injectable } from '@angular/core';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { Supplier } from '@core/models/supplier.model';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'suppliers';
  constructor(private httpService: HttpService) {}

  createSupplier(supplier: Supplier) {
    return this.httpService.post(`${this.apiPrefix}`, supplier);
  }

  getSuppliers(query?: QueryParams) {
    var sanitizedQuery: QueryParams = {};
    if (query)
      sanitizedQuery = {
        pageIndex: query.pageIndex,
        pageSize: query.pageSize,
        sort: query.sort,
        searchText: query.searchText,
      };
    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getSupplierById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateSupplierById(_id: string, updateBody: Supplier) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}

import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { environment } from '../../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { Warehouse } from '@core/models/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class WarehouseApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'warehouses';
  constructor(private httpService: HttpService) {}

  createWarehouse(warehouse: Warehouse) {
    return this.httpService.post(`${this.apiPrefix}`, warehouse);
  }

  getWarehouses(query?: QueryParams) {
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

  getWarehouseById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateWarehouseById(_id: string, updateBody: Warehouse) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}

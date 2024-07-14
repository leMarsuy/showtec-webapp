import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { enviroment } from '../../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { Warehouse } from '@core/models/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class WarehouseApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'warehouses';
  constructor(private httpService: HttpService) {}

  createWarehouse(warehouse: Warehouse) {
    return this.httpService.post(`${this.apiPrefix}`, warehouse);
  }

  getWarehouses(query?: QueryParams) {
    return this.httpService.get(`${this.apiPrefix}`, query);
  }

  getWarehouseById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateWarehouseById(_id: string, updateBody: Warehouse) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}

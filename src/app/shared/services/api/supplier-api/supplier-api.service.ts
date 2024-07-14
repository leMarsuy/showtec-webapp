import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { enviroment } from '../../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { Supplier } from '@core/models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'suppliers';
  constructor(private httpService: HttpService) {}

  createSupplier(supplier: Supplier) {
    return this.httpService.post(`${this.apiPrefix}`, supplier);
  }

  getSuppliers(query?: QueryParams) {
    return this.httpService.get(`${this.apiPrefix}`, query);
  }

  getSupplierById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateSupplierById(_id: string, updateBody: Supplier) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}

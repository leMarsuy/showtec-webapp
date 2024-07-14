import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Customer } from '@core/models/customer.model';
import { enviroment } from '../../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'customers';
  constructor(private httpService: HttpService) {}

  createCustomer(customer: Customer) {
    return this.httpService.post(`${this.apiPrefix}`, customer);
  }

  getCustomers(query: QueryParams) {
    return this.httpService.get(`${this.apiPrefix}`, query);
  }

  getCustomerById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateCustomerById(_id: string, updateBody: Customer) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}

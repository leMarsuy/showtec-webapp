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

  registerCustomer(
    contactPerson: string,
    name: string,
    tin: string,
    email: string,
    mobile: string,
    address: string
  ) {
    return this.httpService.post(`${this.apiPrefix}/register`, {
      name,
      tin,
      contactPerson,
      email,
      mobile,
      address,
    });
  }

  getCustomers(query?: QueryParams) {
    var sanitizedQuery: QueryParams = {};
    if (query)
      sanitizedQuery = {
        pageIndex: query.pageIndex || 0,
        pageSize: query.pageSize || 0,
        sort: query.sort || '',
        searchText: query.searchText || '',
      };
    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getCustomerById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateCustomerById(_id: string, updateBody: Customer) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}

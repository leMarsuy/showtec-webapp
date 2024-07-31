import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { OutDelivery } from '@core/models/out-delivery.model';
import { enviroment } from '../../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class OutDeliveryApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'out-deliveries';
  constructor(private httpService: HttpService) {}

  createOutDelivery(outdelivery: OutDelivery) {
    return this.httpService.post(`${this.apiPrefix}`, outdelivery);
  }

  getOutDeliverys(query?: QueryParams) {
    var sanitizedQuery: QueryParams = {};
    if (query)
      sanitizedQuery = {
        pageIndex: query.pageIndex || 0,
        pageSize: query.pageSize || 0,
        sort: query.sort,
        searchText: query.searchText,
      };
    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getOutDeliveryById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  getPdfOutDelivery(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/pdf/${_id}`);
  }

  getMostRecentOutDelivery() {
    return this.httpService.get(`${this.apiPrefix}/recent`);
  }

  updateOutDeliveryById(_id: string, updateBody: OutDelivery) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}

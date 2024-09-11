import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { OutDelivery } from '@core/models/out-delivery.model';
import { enviroment } from '../../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { FileService } from '../../file/file.service';
import { map } from 'rxjs';
import { Status } from '@app/core/enums/status.enum';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';

@Injectable({
  providedIn: 'root',
})
export class OutDeliveryApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'out-deliveries';
  constructor(private httpService: HttpService, private file: FileService) {}

  createOutDelivery(outdelivery: OutDelivery) {
    return this.httpService.post(`${this.apiPrefix}`, outdelivery);
  }

  getOutDeliverys(query?: QueryParams) {
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

  getOutDeliveryById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  getPdfOutDelivery(_id: string) {
    return this.httpService.getBlob(`${this.apiPrefix}/pdf/${_id}`).pipe(
      map((response: any) => {
        const filename = this.file.getFileNameFromResponseHeader(response);
        return {
          blob: response.body,
          filename,
        };
      })
    );
  }

  getMostRecentOutDelivery() {
    return this.httpService.get(`${this.apiPrefix}/recent`);
  }

  updateOutDeliveryById(_id: string, updateBody: OutDelivery) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }

  patchOutDeliveryStatus(status: OutDeliveryStatus, _id: string) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}/status`, {
      status,
    });
  }

  exportOutDeliveries(query?: QueryParams) {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: 0,
        pageSize: 0,
        searchText: query.searchText || '',
      };
    }
    return this.httpService.getBlob(
      `${this.apiPrefix}/export/excel`,
      sanitizedQuery
    );
  }
}

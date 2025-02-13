import { Injectable } from '@angular/core';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { OutDelivery } from '@core/models/out-delivery.model';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { FileService } from '../../file/file.service';
import { HttpService } from '../../http/http.service';
import { UtilService } from '../../util/util.service';

@Injectable({
  providedIn: 'root',
})
export class OutDeliveryApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'out-deliveries';
  constructor(
    private httpService: HttpService,
    private file: FileService,
    private utilService: UtilService,
  ) {}

  createOutDelivery(outdelivery: OutDelivery) {
    return this.httpService.post(`${this.apiPrefix}`, outdelivery);
  }

  getOutDeliverys(query?: QueryParams & { hasPurchaseOrder?: any }) {
    let sanitizedQuery: any = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort ?? '',
        searchText: query.searchText ?? '',
        status: query.status ?? '',
      };

      if (typeof query.hasPurchaseOrder === 'boolean') {
        sanitizedQuery = {
          ...sanitizedQuery,
          hasPurchaseOrder: query.hasPurchaseOrder,
        };
      }

      if (query?.date) {
        const date = this.utilService.date.dateToQueryParam(query?.date);
        sanitizedQuery = { ...sanitizedQuery, date };
      }
    }
    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getOutDeliveryById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  getOutDeliveryByIdWithItemPrices(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}/prices`);
  }

  getOutDeliveryByCode(code: string) {
    return this.httpService.get(`${this.apiPrefix}/code/${code}`);
  }

  getPdfOutDelivery(_id: string) {
    return this.httpService.getBlob(`${this.apiPrefix}/pdf/${_id}`).pipe(
      map((response: any) => {
        const filename = this.file.getFileNameFromResponseHeader(response);
        return {
          blob: response.body,
          filename,
        };
      }),
    );
  }

  getPdfOutDeliveryByCode(code: string) {
    return this.httpService.getBlob(`${this.apiPrefix}/pdf/${code}`).pipe(
      map((response: any) => {
        const filename = this.file.getFileNameFromResponseHeader(response);
        return {
          blob: response.body,
          filename,
        };
      }),
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
        searchText: query.searchText ?? '',
        status: query.status ?? '',
      };

      if (query?.date) {
        const date = this.utilService.date.dateToQueryParam(query?.date);
        sanitizedQuery = { ...sanitizedQuery, date };
      }
    }

    return this.httpService.getBlob(
      `${this.apiPrefix}/export/excel`,
      sanitizedQuery,
    );
  }

  cancelOutDeliveryById(_id: string) {
    const status = OutDeliveryStatus.CANCELLED;
    return this.httpService.patch(`${this.apiPrefix}/${_id}/cancel`, {
      status,
    });
  }
}

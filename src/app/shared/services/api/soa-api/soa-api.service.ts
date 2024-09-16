import { Injectable } from '@angular/core';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { SOA, Transaction } from '@app/core/models/soa.model';
import { environment } from '@env/environment';
import { HttpService } from '../../http/http.service';
import { map } from 'rxjs';
import { FileService } from '../../file/file.service';

@Injectable({
  providedIn: 'root',
})
export class SoaApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'soa';
  constructor(private httpService: HttpService, private file: FileService) {}

  createSoa(soa: SOA) {
    return this.httpService.post(`${this.apiPrefix}`, soa);
  }

  createPayment(_id: string, transaction: Transaction) {
    return this.httpService.post(
      `${this.apiPrefix}/payment/${_id}`,
      transaction
    );
  }

  deletePayment(_transId: string) {
    return this.httpService.delete(`${this.apiPrefix}/payment/${_transId}`);
  }

  updatePayment(_transId: string, body: any) {
    return this.httpService.patch(
      `${this.apiPrefix}/payment/${_transId}`,
      body
    );
  }

  getSoas(query?: QueryParams, monitorStatus?: string) {
    var sanitizedQuery: QueryParams = {};
    if (query)
      sanitizedQuery = {
        pageIndex: query.pageIndex || 0,
        pageSize: query.pageSize || 0,
        sort: query.sort || '',
        searchText: query.searchText || '',
      };

    monitorStatus = monitorStatus || '';

    return this.httpService.get(`${this.apiPrefix}`, {
      ...sanitizedQuery,
      monitorStatus,
    });
  }

  getSoaById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateSoaById(_id: string, updateBody: SOA) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }

  getPdfSoa(_id: string) {
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

  getMostRecentSoa() {
    return this.httpService.get(`${this.apiPrefix}/recent`);
  }
}

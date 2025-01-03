import { Injectable } from '@angular/core';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { SOA, Transaction } from '@app/core/models/soa.model';
import { environment } from '@env/environment';
import { HttpService } from '../../http/http.service';
import { map } from 'rxjs';
import { FileService } from '../../file/file.service';
import { UtilService } from '../../util/util.service';

@Injectable({
  providedIn: 'root',
})
export class SoaApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'soa';
  constructor(
    private httpService: HttpService,
    private file: FileService,
    private utilService: UtilService,
  ) {}

  createSoa(soa: SOA) {
    return this.httpService.post(`${this.apiPrefix}`, soa);
  }

  createPayment(soaId: string, transaction: Transaction) {
    return this.httpService.post(
      `${this.apiPrefix}/payment/${soaId}`,
      transaction
    );
  }

  deletePayment(_transId: string) {
    return this.httpService.delete(`${this.apiPrefix}/payment/${_transId}`);
  }

  updatePayment(_transId: string, body: any) {
    return this.httpService.patch(
      `${this.apiPrefix}/payment/${_transId}`,
      body,
    );
  }

  getSoas(query?: QueryParams) {
    let sanitizedQuery: any = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort ?? '',
        searchText: query.searchText ?? '',
        monitorStatus: query.status ?? '', // monitorStatus is used
      };

      if (query?.date) {
        const date = this.utilService.date.dateToQueryParam(query?.date);
        sanitizedQuery = { ...sanitizedQuery, date };
      }
    }

    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
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
      }),
    );
  }

  getMostRecentSoa() {
    return this.httpService.get(`${this.apiPrefix}/recent`);
  }

  exportExcelSoas(query?: QueryParams) {
    let sanitizedQuery: any = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: 0,
        pageSize: 0,
        searchText: query.searchText ?? '',
        monitorStatus: query.status ?? '', // monitorStatus is used
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
}

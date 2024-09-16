import { Injectable } from '@angular/core';
import { enviroment } from '@env/environment';
import { HttpService } from '../../http/http.service';
import { Voucher } from '@app/core/models/voucher.model';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { Status } from '@app/core/enums/status.enum';

@Injectable({
  providedIn: 'root',
})
export class VoucherApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'vouchers';

  constructor(private httpService: HttpService) {}

  createVoucher(voucher: Voucher) {
    return this.httpService.post(`${this.apiPrefix}`, voucher);
  }

  getVouchers(query?: QueryParams, status: string = '') {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex || 0,
        pageSize: query.pageSize || 0,
        sort: query.sort,
        searchText: query.searchText,
      };
    }
    return this.httpService.get(`${this.apiPrefix}`, {
      ...sanitizedQuery,
      status,
    });
  }

  getVoucherById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateVoucherById(_id: string, updateBody: Voucher) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }

  patchVoucherStatusById(_id: string, status: Status) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}/status`, status);
  }

  deleteVoucherStatusById(_id: string, status: Status) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}/delete`, status);
  }
}
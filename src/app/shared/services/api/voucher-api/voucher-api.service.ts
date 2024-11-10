import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Voucher } from '@app/core/models/voucher.model';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { Status } from '@app/core/enums/status.enum';
import { environment } from '@env/environment';
import { map } from 'rxjs';
import { FileService } from '../../file/file.service';
import { VoucherStatus } from '@app/core/enums/voucher-status.enum';

@Injectable({
  providedIn: 'root',
})
export class VoucherApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'vouchers';

  private httpService = inject(HttpService);
  private file = inject(FileService);

  createVoucher(voucher: Voucher) {
    return this.httpService.post(`${this.apiPrefix}`, voucher);
  }

  getVouchers(query?: QueryParams, dateFilter?: any, status: string = '') {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort,
        searchText: query.searchText,
      };
    }

    let params: any = { ...sanitizedQuery, status };
    if (dateFilter) {
      if (typeof dateFilter === 'object') {
        const filterObj = JSON.stringify(dateFilter);
        params = { ...params, dateFilter: filterObj };
      } else {
        params = { ...params, dateFilter };
      }
    }

    return this.httpService.get(`${this.apiPrefix}`, params);
  }

  getVoucherById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  getRecentVoucher() {
    return this.httpService.get(`${this.apiPrefix}/recent`);
  }

  updateVoucherById(_id: string, updateBody: Voucher) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }

  patchVoucherStatusById(_id: string, status: VoucherStatus) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}/status`, {
      status,
    });
  }

  deleteVoucherStatusById(_id: string) {
    const status = VoucherStatus.DELETED;
    return this.httpService.patch(`${this.apiPrefix}/${_id}/delete`, {
      status,
    });
  }
  getVoucherPdfReceipt(_id: string) {
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

  exportExcelVouchers(query?: QueryParams, status: string = '') {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: 0,
        pageSize: 0,
        searchText: query.searchText || '',
      };
    }
    return this.httpService.getBlob(`${this.apiPrefix}/export/excel`, {
      ...sanitizedQuery,
      status,
    });
  }
}

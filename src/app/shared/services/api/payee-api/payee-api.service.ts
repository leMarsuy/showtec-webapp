import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '../../http/http.service';
import { FileService } from '../../file/file.service';
import { Payee } from '@app/core/models/payee.model';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { Status } from '@app/core/enums/status.enum';

@Injectable({
  providedIn: 'root',
})
export class PayeeApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'payees';

  constructor(
    private readonly httpService: HttpService,
    private readonly file: FileService
  ) {}

  createPayee(payee: Payee) {
    return this.httpService.post(`${this.apiPrefix}`, payee);
  }

  getPayees(query?: QueryParams, status = Status.ACTIVE) {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort,
        searchText: query.searchText,
      };
    }
    return this.httpService.get(`${this.apiPrefix}`, {
      ...sanitizedQuery,
      status,
    });
  }

  getPayeeById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  getRecentPayee() {
    return this.httpService.get(`${this.apiPrefix}/recent`);
  }

  updatePayeeById(_id: string, updateBody: Payee) {
    return this.httpService.put(`${this.apiPrefix}/${_id}`, updateBody);
  }

  patchPayeeStatusById(_id: string, status: Status) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}/status`, {
      status,
    });
  }
}

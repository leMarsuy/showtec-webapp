import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { UtilService } from '../../util/util.service';
import { FileService } from '../../file/file.service';
import { Role } from '@app/core/models/role.model';
import { QueryParams } from '@app/core/interfaces/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleApiService {
  private readonly apiPrefix = 'roles';

  private readonly httpService = inject(HttpService);
  private readonly utilService = inject(UtilService);
  private readonly file = inject(FileService);

  createRole(role: Role) {
    return this.httpService.post(`${this.apiPrefix}`, role);
  }

  getRoles(query?: QueryParams) {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort,
        searchText: query.searchText,
        status: query.status ?? '',
      };

      if (query?.date) {
        sanitizedQuery = this.utilService.date.dateToQueryParam(
          sanitizedQuery,
          query?.date,
        );
      }
    }

    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getRoleById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateRoleById(_id: string, updateBody: Role) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }

  exportExcelTransactions(query?: QueryParams) {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: 0,
        pageSize: 0,
        searchText: query.searchText ?? '',
        status: query?.status ?? '',
      };

      if (query?.date) {
        sanitizedQuery = this.utilService.date.dateToQueryParam(
          sanitizedQuery,
          query?.date,
        );
      }
    }
    return this.httpService.getBlob(
      `${this.apiPrefix}/export/excel`,
      sanitizedQuery,
    );
  }
}

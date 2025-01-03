import { inject, Injectable } from '@angular/core';
import { Status } from '@app/core/enums/status.enum';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { Role } from '@app/core/models/role.model';
import { FileService } from '../../file/file.service';
import { HttpService } from '../../http/http.service';
import { UtilService } from '../../util/util.service';

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
    let sanitizedQuery: QueryParams = {
      pageIndex: query?.pageIndex ?? 0,
      pageSize: query?.pageSize ?? 0,
      sort: query?.sort ?? undefined,
      searchText: query?.searchText ?? '',
      status: query?.status ?? '',
    };

      if (query?.date) {
        sanitizedQuery = this.utilService.date.dateToQueryParam(
          sanitizedQuery,
          query?.date,
        );
      }

    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getRoleById(roleId: string) {
    return this.httpService.get(`${this.apiPrefix}/${roleId}`);
  }

  updateRoleById(roleId: string, updateBody: Role) {
    return this.httpService.patch(`${this.apiPrefix}/${roleId}`, updateBody);
  }

  patchRoleStatus(roleId: string, status: Status) {
    return this.httpService.patch(`${this.apiPrefix}/${roleId}/status`, { status });
  }

  checkRoleIfHasExistingUser(roleId: string) {
    return this.httpService.get(`${this.apiPrefix}/${roleId}/has-existing-users`);
  }


}

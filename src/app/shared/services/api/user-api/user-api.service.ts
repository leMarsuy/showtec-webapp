import { Injectable } from '@angular/core';
import { Status } from '@app/core/enums/status.enum';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { User } from '@core/models/user.model';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'users';
  constructor(private httpService: HttpService) {}

  createUser(user: User) {
    return this.httpService.post(`${this.apiPrefix}`, user);
  }

  getUsers(query?: QueryParams) {
    let sanitizedQuery: QueryParams = {};
    if (query)
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort ?? '',
        searchText: query.searchText ?? '',
        status: query.status ?? '',
      };
    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getUserById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateUserById(_id: string, updateBody: User) {
    return this.httpService.put(`${this.apiPrefix}/${_id}`, updateBody);
  }

  patchUserStatus(userId: string, status: Status) {
    return this.httpService.patch(`${this.apiPrefix}/${userId}/status`, {
      status,
    });
  }
}

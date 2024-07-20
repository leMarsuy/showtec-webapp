import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { User } from '@core/models/user.model';
import { enviroment } from '../../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'users';
  constructor(private httpService: HttpService) {}

  createUser(user: User) {
    return this.httpService.post(`${this.apiPrefix}`, user);
  }

  getUsers(query?: QueryParams) {
    var sanitizedQuery: QueryParams = {};
    if (query)
      sanitizedQuery = {
        pageIndex: query.pageIndex || 0,
        pageSize: query.pageSize || 0,
        sort: query.sort,
        searchText: query.searchText,
      };
    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getUserById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateUserById(_id: string, updateBody: User) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}

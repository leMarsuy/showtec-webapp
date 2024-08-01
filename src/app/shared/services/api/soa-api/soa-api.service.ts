import { Injectable } from '@angular/core';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { SOA } from '@app/core/models/soa.model';
import { enviroment } from '@env/environment';
import { HttpService } from '../../http/http.service';
import { map } from 'rxjs';
import { FileService } from '../../file/file.service';

@Injectable({
  providedIn: 'root',
})
export class SoaApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'soa';
  constructor(private httpService: HttpService, private file: FileService) {}

  createSoa(soa: SOA) {
    return this.httpService.post(`${this.apiPrefix}`, soa);
  }

  getSoas(query?: QueryParams) {
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
}

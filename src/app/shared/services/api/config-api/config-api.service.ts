import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigApiService {
  private readonly apiUrl = environment.API_URL;
  private readonly apiPrefix = 'config';
  constructor(private httpService: HttpService) {}

  createConfig(config: any) {
    return this.httpService.post(`${this.apiPrefix}`, config);
  }

  getConfigByName(name: string) {
    return this.httpService.get(`${this.apiPrefix}/${name}`);
  }

  updateConfigByName(name: string, updateBody: any) {
    return this.httpService.put(`${this.apiPrefix}/${name}`, updateBody);
  }
}

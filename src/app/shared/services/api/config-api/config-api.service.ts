import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '../../http/http.service';

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

  getProductClassifications() {
    return this.httpService.get(`${this.apiPrefix}/productClassifications`);
  }

  getConfigByName(name: string) {
    return this.httpService.get(`${this.apiPrefix}/${name}`);
  }

  updateConfigByName(name: string, updateBody: any) {
    return this.httpService.put(`${this.apiPrefix}/${name}`, updateBody);
  }

  getPortalConfig() {
    return this.httpService.get(`${this.apiPrefix}/cache/portal`);
  }

  getRolesConfig() {
    return this.httpService.get(`${this.apiPrefix}/cache/roles`);
  }
}

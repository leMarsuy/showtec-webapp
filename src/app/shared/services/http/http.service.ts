import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  apiUrl = enviroment.API_URL;

  constructor(private http: HttpClient) {
    console.log(this.apiUrl);
    console.log(enviroment);
  }

  get options() {
    const authToken = localStorage.getItem('auth');
    const headers = new HttpHeaders({
      authorization: `Bearer ${authToken}`,
    });

    return { headers };
  }

  queryParams(query: QueryParams) {
    return new HttpParams({
      fromObject: query as any,
    });
  }

  get<T>(endpoint: string, query?: any) {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
      ...this.options,
      params: query ? this.queryParams(query) : {},
    });
  }

  post<T>(endpoint: string, body: any) {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, this.options);
  }

  patch<T>(endpoint: string, body: any) {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, body, this.options);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '@core/models/user.model';
import { environment } from '../../../../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.API_URL;
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<User & { token?: string }>(this.apiUrl + '/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          console.log(response);
          localStorage.setItem('auth', response.token || '');
        })
      );
  }

  logout() {
    return this.http
      .post(
        this.apiUrl + '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth')}`,
          },
        }
      )
      .pipe(
        tap(() => {
          localStorage.removeItem('auth');
        })
      );
  }

  me() {
    return this.http.get<User & { token?: string }>(this.apiUrl + '/auth/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth')}`,
      },
    });
  }
}

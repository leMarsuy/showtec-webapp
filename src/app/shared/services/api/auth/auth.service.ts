import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserActions } from '@app/core/states/user';
import { User } from '@core/models/user.model';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.API_URL;
  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<User & { token?: string }>(this.apiUrl + '/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('auth', response.token ?? '');
          delete response.token;
          this.store.dispatch(UserActions.setUser(response));
        }),
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
        },
      )
      .pipe(
        tap(() => {
          this.store.dispatch(UserActions.removeUser({}));
          localStorage.removeItem('auth');
        }),
      );
  }

  me() {
    return this.http.get<User & { token?: string }>(this.apiUrl + '/auth/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth')}`,
      },
    });
  }

  verifyResetPasswordToken(token: string) {
    const queryParams = new HttpParams({
      fromObject: {
        token,
      },
    });
    return this.http.get<{
      found: boolean;
    }>(environment.API_URL + `/auth/reset-password`, {
      params: queryParams,
    });
  }

  resetPassword(body: object) {
    return this.http.post(environment.API_URL + `/auth/reset-password`, body);
  }

  forgotPassword(email: string) {
    return this.http.post(environment.API_URL + `/auth/forgot-password`, {
      email,
    });
  }

  updatePassword(body: object) {
    return this.http.put(environment.API_URL + '/auth/update-password', body);
  }
}

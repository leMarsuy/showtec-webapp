import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private rolesConfig: any;

  fetchRoles$ = new Subject<void>();

  setRolesConfig(config: any) {
    this.rolesConfig = config;
  }

  getRolesConfig() {
    return this.rolesConfig;
  }
}

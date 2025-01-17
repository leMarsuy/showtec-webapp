import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  fetchRoles$ = new Subject<void>();
  constructor() {}
}

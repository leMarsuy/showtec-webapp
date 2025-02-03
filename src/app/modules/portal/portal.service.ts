import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private portalNavigationSubject = new BehaviorSubject<any>({});

  portalNavigation$: Observable<any> =
    this.portalNavigationSubject.asObservable();

  setPortalNavigation(navigations: any) {
    this.portalNavigationSubject.next(navigations);
  }
}

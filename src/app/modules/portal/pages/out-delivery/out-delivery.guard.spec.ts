import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { outDeliveryGuard } from './out-delivery.guard';

describe('outDeliveryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => outDeliveryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

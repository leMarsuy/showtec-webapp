import { TestBed } from '@angular/core/testing';

import { PurchaseOrderApiService } from './purchase-order-api.service';

describe('PurchaseOrderApiService', () => {
  let service: PurchaseOrderApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseOrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

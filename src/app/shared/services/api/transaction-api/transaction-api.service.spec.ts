import { TestBed } from '@angular/core/testing';

import { TransactionApiService } from './transaction-api.service';

describe('TransactionApiService', () => {
  let service: TransactionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

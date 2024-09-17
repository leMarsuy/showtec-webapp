import { TestBed } from '@angular/core/testing';

import { VoucherApiService } from './voucher-api.service';

describe('VoucherApiService', () => {
  let service: VoucherApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

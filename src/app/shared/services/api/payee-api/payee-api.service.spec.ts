import { TestBed } from '@angular/core/testing';

import { PayeeApiService } from './payee-api.service';

describe('PayeeApiService', () => {
  let service: PayeeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayeeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

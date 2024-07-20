import { TestBed } from '@angular/core/testing';

import { OutDeliveryApiService } from './out-delivery-api.service';

describe('OutDeliveryApiService', () => {
  let service: OutDeliveryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutDeliveryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

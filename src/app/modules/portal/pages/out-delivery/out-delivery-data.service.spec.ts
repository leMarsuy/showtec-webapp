import { TestBed } from '@angular/core/testing';

import { OutDeliveryDataService } from './out-delivery-data.service';

describe('OutDeliveryDataService', () => {
  let service: OutDeliveryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutDeliveryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

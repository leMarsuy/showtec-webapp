import { TestBed } from '@angular/core/testing';

import { SoaApiService } from './soa-api.service';

describe('SoaApiService', () => {
  let service: SoaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

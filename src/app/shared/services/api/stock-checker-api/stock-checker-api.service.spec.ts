import { TestBed } from '@angular/core/testing';

import { StockCheckerApiService } from './stock-checker-api.service';

describe('StockCheckerApiService', () => {
  let service: StockCheckerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockCheckerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

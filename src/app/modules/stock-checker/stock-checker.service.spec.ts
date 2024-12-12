import { TestBed } from '@angular/core/testing';

import { StockCheckerService } from './stock-checker.service';

describe('StockCheckerService', () => {
  let service: StockCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

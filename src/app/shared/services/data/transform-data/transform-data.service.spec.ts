import { TestBed } from '@angular/core/testing';
import { TransformDataService } from './transform-data.service';

describe('TransformDataService', () => {
  let service: TransformDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransformDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

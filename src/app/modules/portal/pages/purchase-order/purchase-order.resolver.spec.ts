import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { purchaseOrderResolver } from './purchase-order.resolver';

describe('purchaseOrderResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => purchaseOrderResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

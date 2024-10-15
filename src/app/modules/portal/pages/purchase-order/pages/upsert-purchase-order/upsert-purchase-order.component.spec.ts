import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPurchaseOrderComponent } from './upsert-purchase-order.component';

describe('UpsertPurchaseOrderComponent', () => {
  let component: UpsertPurchaseOrderComponent;
  let fixture: ComponentFixture<UpsertPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertPurchaseOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

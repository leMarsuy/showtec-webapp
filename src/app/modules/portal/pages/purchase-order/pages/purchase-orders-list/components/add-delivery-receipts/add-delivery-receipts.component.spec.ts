import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryReceiptsComponent } from './add-delivery-receipts.component';

describe('AddDeliveryReceiptsComponent', () => {
  let component: AddDeliveryReceiptsComponent;
  let fixture: ComponentFixture<AddDeliveryReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDeliveryReceiptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeliveryReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

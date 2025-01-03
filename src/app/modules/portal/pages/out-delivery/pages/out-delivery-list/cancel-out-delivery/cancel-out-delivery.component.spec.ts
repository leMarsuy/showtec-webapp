import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOutDeliveryComponent } from './cancel-out-delivery.component';

describe('CancelOutDeliveryComponent', () => {
  let component: CancelOutDeliveryComponent;
  let fixture: ComponentFixture<CancelOutDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelOutDeliveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelOutDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

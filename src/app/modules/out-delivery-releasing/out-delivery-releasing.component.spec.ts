import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutDeliveryReleasingComponent } from './out-delivery-releasing.component';

describe('OutDeliveryReleasingComponent', () => {
  let component: OutDeliveryReleasingComponent;
  let fixture: ComponentFixture<OutDeliveryReleasingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutDeliveryReleasingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutDeliveryReleasingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

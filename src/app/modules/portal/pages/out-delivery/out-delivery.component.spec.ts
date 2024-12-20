import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutDeliveryComponent } from './out-delivery.component';

describe('OutDeliveryComponent', () => {
  let component: OutDeliveryComponent;
  let fixture: ComponentFixture<OutDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutDeliveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

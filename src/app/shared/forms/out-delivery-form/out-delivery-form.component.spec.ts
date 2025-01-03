import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutDeliveryFormComponent } from './out-delivery-form.component';

describe('OutDeliveryFormComponent', () => {
  let component: OutDeliveryFormComponent;
  let fixture: ComponentFixture<OutDeliveryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutDeliveryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutDeliveryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

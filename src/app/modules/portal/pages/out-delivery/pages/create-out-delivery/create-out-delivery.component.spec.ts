import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOutDeliveryComponent } from './create-out-delivery.component';

describe('CreateOutDeliveryComponent', () => {
  let component: CreateOutDeliveryComponent;
  let fixture: ComponentFixture<CreateOutDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOutDeliveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOutDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOutDeliveryComponent } from './edit-out-delivery.component';

describe('EditOutDeliveryComponent', () => {
  let component: EditOutDeliveryComponent;
  let fixture: ComponentFixture<EditOutDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOutDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOutDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

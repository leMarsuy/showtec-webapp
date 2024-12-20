import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutDeliveryListComponent } from './out-delivery-list.component';

describe('OutDeliveryListComponent', () => {
  let component: OutDeliveryListComponent;
  let fixture: ComponentFixture<OutDeliveryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutDeliveryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutDeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachCustomerFormComponent } from './customer-form.component';

describe('AttachCustomerFormComponent', () => {
  let component: AttachCustomerFormComponent;
  let fixture: ComponentFixture<AttachCustomerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttachCustomerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachCustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

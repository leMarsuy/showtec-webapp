import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsFormComponent } from './discounts-form.component';

describe('DiscountsFormComponent', () => {
  let component: DiscountsFormComponent;
  let fixture: ComponentFixture<DiscountsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscountsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPaidComponent } from './total-paid.component';

describe('TotalPaidComponent', () => {
  let component: TotalPaidComponent;
  let fixture: ComponentFixture<TotalPaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPaidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

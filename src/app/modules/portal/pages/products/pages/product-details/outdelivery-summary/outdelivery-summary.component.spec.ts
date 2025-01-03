import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdeliverySummaryComponent } from './outdelivery-summary.component';

describe('OutdeliverySummaryComponent', () => {
  let component: OutdeliverySummaryComponent;
  let fixture: ComponentFixture<OutdeliverySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutdeliverySummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutdeliverySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

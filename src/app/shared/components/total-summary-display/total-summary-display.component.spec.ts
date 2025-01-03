import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSummaryDisplayComponent } from './total-summary-display.component';

describe('TotalSummaryDisplayComponent', () => {
  let component: TotalSummaryDisplayComponent;
  let fixture: ComponentFixture<TotalSummaryDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalSummaryDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalSummaryDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

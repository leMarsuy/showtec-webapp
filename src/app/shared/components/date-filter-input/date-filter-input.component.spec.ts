import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFilterInputComponent } from './date-filter-input.component';

describe('DateFilterInputComponent', () => {
  let component: DateFilterInputComponent;
  let fixture: ComponentFixture<DateFilterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateFilterInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateFilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertExpenseComponent } from './upsert-expense.component';

describe('UpsertExpenseComponent', () => {
  let component: UpsertExpenseComponent;
  let fixture: ComponentFixture<UpsertExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertExpenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

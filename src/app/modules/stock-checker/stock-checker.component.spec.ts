import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCheckerComponent } from './stock-checker.component';

describe('StockCheckerComponent', () => {
  let component: StockCheckerComponent;
  let fixture: ComponentFixture<StockCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockCheckerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StockCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDropListComponent } from './stock-drop-list.component';

describe('StockDropListComponent', () => {
  let component: StockDropListComponent;
  let fixture: ComponentFixture<StockDropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockDropListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockDropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

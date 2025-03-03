import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferDialogComponent } from './stock-transfer-dialog.component';

describe('StockTransferDialogComponent', () => {
  let component: StockTransferDialogComponent;
  let fixture: ComponentFixture<StockTransferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTransferDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockTransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

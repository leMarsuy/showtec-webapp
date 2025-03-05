import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseStockHistoryDialogComponent } from './warehouse-stock-history-dialog.component';

describe('WarehouseStockHistoryDialogComponent', () => {
  let component: WarehouseStockHistoryDialogComponent;
  let fixture: ComponentFixture<WarehouseStockHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseStockHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseStockHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

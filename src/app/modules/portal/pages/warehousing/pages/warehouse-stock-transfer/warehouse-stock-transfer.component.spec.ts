import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseStockTransferComponent } from './warehouse-stock-transfer.component';

describe('WarehouseStockTransferComponent', () => {
  let component: WarehouseStockTransferComponent;
  let fixture: ComponentFixture<WarehouseStockTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarehouseStockTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

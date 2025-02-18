import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousePreviewListComponent } from './warehouse-preview-list.component';

describe('WarehousePreviewListComponent', () => {
  let component: WarehousePreviewListComponent;
  let fixture: ComponentFixture<WarehousePreviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarehousePreviewListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehousePreviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticTableCellComponent } from './static-table-cell.component';

describe('StaticTableCellComponent', () => {
  let component: StaticTableCellComponent;
  let fixture: ComponentFixture<StaticTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticTableCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

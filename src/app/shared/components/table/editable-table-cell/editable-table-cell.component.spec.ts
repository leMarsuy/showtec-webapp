import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableTableCellComponent } from './editable-table-cell.component';

describe('EditableTableCellComponent', () => {
  let component: EditableTableCellComponent;
  let fixture: ComponentFixture<EditableTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableTableCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

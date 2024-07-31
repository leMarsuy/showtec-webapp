import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '@app/core/interfaces/table-column.interface';

@Component({
  selector: 'app-editable-table-cell',
  templateUrl: './editable-table-cell.component.html',
  styleUrl: './editable-table-cell.component.scss',
})
export class EditableTableCellComponent {
  @Input() column!: TableColumn;
  @Input() element!: any;
  @Input() rowIndex!: any;
  @Input() colIndex!: any;
  @Output() actionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateCellEmitter: EventEmitter<any> = new EventEmitter();

  updateCell(
    element: any,
    column: TableColumn,
    value: any,
    rowIndex: number,
    colIndex: number
  ) {
    if (value != 0 && !value) return;
    // deepInsert(value, column.dotNotationPath, element);
    this.updateCellEmitter.emit({
      element,
      column,
      newValue: value,
    });
    delete element['__editOn' + colIndex + '_' + rowIndex];
    delete element['__value' + colIndex + '_' + rowIndex];
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { deepFind } from '@app/shared/utils/deepfind';

@Component({
  selector: 'app-editable-table-cell',
  templateUrl: './editable-table-cell.component.html',
  styleUrl: './editable-table-cell.component.scss',
})
export class EditableTableCellComponent implements OnInit {
  @Input() column!: TableColumn;
  @Input() element!: any;
  @Input() rowIndex!: any;
  @Input() colIndex!: any;
  @Output() actionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateCellEmitter: EventEmitter<any> = new EventEmitter();

  type = 'text';

  ngOnInit(): void {
    if (['number', 'percentage', 'currency'].includes(this.column.type))
      this.type = 'number';
    else this.type = 'text';

    if (typeof this.column.dotNotationPath == 'string')
      this.element['__value' + this.rowIndex + '_' + this.colIndex] = deepFind(
        this.element,
        this.column.dotNotationPath,
      );
  }

  updateCell(
    element: any,
    column: TableColumn,
    value: any,
    rowIndex: number,
    colIndex: number,
  ) {
    if (value != 0 && !value) return;
    this.updateCellEmitter.emit({
      element,
      column,
      newValue: value,
    });
    delete element['__editOn' + colIndex + '_' + rowIndex];
    delete element['__value' + colIndex + '_' + rowIndex];
  }
}

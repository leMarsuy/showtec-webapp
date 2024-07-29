import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { PageEvent } from '@angular/material/paginator';
import { AgingType } from '@app/core/enums/aging-type.enum';
import { Color } from '@app/core/enums/color.enum';
import { deepFind } from '@app/shared/utils/deepfind';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  agingDays = AgingType.DAYS;
  @Input() hasPagination: boolean = true;
  @Input() dataSource: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };
  @Output() rowEmitter: EventEmitter<any> = new EventEmitter();
  @Output() pageEmitter: EventEmitter<PageEvent> = new EventEmitter();
  @Output() actionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateCellEmitter: EventEmitter<any> = new EventEmitter();

  constructor() {}
  get displayedColumns() {
    return [...this.columns.map((column) => column.label)];
  }

  updateCell(
    element: any,
    column: TableColumn,
    value: any,
    rowIndex: number,
    colIndex: number
  ) {
    if (!value) return;
    // deepInsert(value, column.dotNotationPath, element);
    this.updateCellEmitter.emit({
      element,
      column,
      newValue: value,
    });
    delete element['__editOn' + colIndex + '_' + rowIndex];
    delete element['__value' + colIndex + '_' + rowIndex];
  }

  _cssStatus(element: any, column: TableColumn) {
    var color: Color = Color.DEAD;
    var value = deepFind(element, column.dotNotationPath);

    color = column.colorCodes
      ? column.colorCodes.find((cc) => cc.value == value)?.color || Color.DEAD
      : Color.DEAD;

    return `w-fit px-4 border-2 border-${color}-500 text-${color}-500 bg-${color}-100 text-center rounded-xl`;
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from '@app/core/enums/color.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { deepFind } from '@app/shared/utils/deepfind';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
})
export class TableCellComponent {
  @Input() column!: TableColumn;
  @Input() element!: any;
  @Input() rowIndex!: any;
  @Input() colIndex!: any;
  @Output() actionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateCellEmitter: EventEmitter<any> = new EventEmitter();

  _cssStatus(element: any, column: TableColumn) {
    var color: Color = Color.DEAD;
    var value = deepFind(element, column.dotNotationPath);

    color = column.colorCodes
      ? column.colorCodes.find((cc) => cc.value == value)?.color || Color.DEAD
      : Color.DEAD;

    return `w-fit px-4 border-2 border-${color}-500 text-${color}-500 bg-${color}-100 text-center rounded-xl`;
  }

  updateCellEvent(event: any) {
    this.element['__editOn' + this.rowIndex + '_' + this.colIndex] = false;
    this.updateCellEmitter.emit(event);
  }
}

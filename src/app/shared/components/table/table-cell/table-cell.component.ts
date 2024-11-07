import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Color } from '@app/core/enums/color.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { UtilService } from '@app/shared/services/util/util.service';
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

  utilService = inject(UtilService);

  _cssStatus(element: any, column: TableColumn) {
    let value: any;

    if (typeof column.dotNotationPath === 'string') {
      value = deepFind(element, column.dotNotationPath);
    }

    const colorCodes = column?.colorCodes?.find(
      (cc) => cc.value == value
    )?.color;

    const color = colorCodes ?? Color.DEAD;

    return `w-fit px-4 border-2 border-${color}-500 text-${color}-500 bg-${color}-100 text-center rounded-xl`;
  }

  updateCellEvent(event: any) {
    this.element['__editOn' + this.rowIndex + '_' + this.colIndex] = false;
    this.updateCellEmitter.emit(event);
  }
}

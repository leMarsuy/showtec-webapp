import { Component, Input } from '@angular/core';
import { AgingType } from '@app/core/enums/aging-type.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';

@Component({
  selector: 'app-static-table-cell',
  templateUrl: './static-table-cell.component.html',
  styleUrl: './static-table-cell.component.scss',
})
export class StaticTableCellComponent {
  agingDays = AgingType.DAYS;

  @Input() column!: TableColumn;
  @Input() element!: any;
}

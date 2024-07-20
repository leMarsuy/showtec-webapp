import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { PageEvent } from '@angular/material/paginator';
import { AgingType } from '@app/core/enums/aging-type.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  agingDays = AgingType.DAYS;
  @Input() dataSource: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };
  @Output() rowEmitter: EventEmitter<any> = new EventEmitter();
  @Output() pageEmitter: EventEmitter<PageEvent> = new EventEmitter();

  constructor() {}
  get displayedColumns() {
    return [...this.columns.map((column) => column.label)];
  }
}

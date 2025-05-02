import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() hasPagination: boolean = true;
  @Input() dataSource: any = [];
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

  onPaginationChange(event: any) {
    const pageIndex = event.pageIndex - 1;

    this.pageEmitter.emit({
      pageIndex,
      pageSize: event.pageSize,
      length: event.length,
    });
  }
}

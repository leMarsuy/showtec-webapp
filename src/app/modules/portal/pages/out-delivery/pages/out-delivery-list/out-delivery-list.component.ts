import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';

@Component({
  selector: 'app-out-delivery-list',
  templateUrl: './out-delivery-list.component.html',
  styleUrl: './out-delivery-list.component.scss',
})
export class OutDeliveryListComponent {
  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  columns: TableColumn[] = [
    {
      label: 'D/R No.',
      dotNotationPath: '',
      type: ColumnType.STRING,
    },
    {
      label: 'No. of Items',
      dotNotationPath: '',
      type: ColumnType.STRING,
    },
    {
      label: 'Created By',
      dotNotationPath: '',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: '',
      type: ColumnType.STRING,
    },
  ];
}

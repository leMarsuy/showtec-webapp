import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';
import { TableColumn } from '@app/core/interfaces/table-column.interface';

@Component({
  selector: 'app-out-delivery',
  templateUrl: './out-delivery.component.html',
  styleUrl: './out-delivery.component.scss',
})
export class OutDeliveryComponent {
  // content header

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Create Delivery Receipt',
      icon: 'add',
    },
  ];

  // table module

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
  ];

  actionEvent(action: string) {}
}

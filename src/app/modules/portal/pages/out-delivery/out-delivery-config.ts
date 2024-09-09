import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';

export const OUT_DELIVER_CONFIG = {
  tableColumns: [
    {
      label: 'D/R No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Customer',
      dotNotationPath: '_customerId.name',
      type: ColumnType.STRING,
    },
    {
      label: 'No. of Items',
      dotNotationPath: 'items.length',
      type: ColumnType.STRING,
    },
    {
      label: 'Delivery Date',
      dotNotationPath: 'deliveryDate',
      type: ColumnType.DATE,
    },
    {
      label: 'Due Date',
      dotNotationPath: 'deliveryDate',
      type: ColumnType.AGE_IN_DAYS,
    },

    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'Print',
          icon: 'print',
          action: 'print',
          color: Color.DEAD,
        },
        {
          name: 'Edit Item',
          icon: 'edit',
          action: 'edit',
          color: Color.WARNING,
        },
        {
          name: 'Cancel Item',
          icon: 'block',
          action: 'change-status-cancel',
          color: Color.ERROR,
        },
      ],
    },
  ],
  cancellationDialog: {
    title: 'Delivery Cancellation',
    message: 'Do you want to cancel this delivery?',
  },
};

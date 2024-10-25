import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';

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
      label: 'Contact Person',
      dotNotationPath: '_customerId.contactPerson',
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
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          value: OutDeliveryStatus.ACTIVE,
          color: Color.SUCCESS,
        },
        {
          value: OutDeliveryStatus.PENDING,
          color: Color.INFO,
        },
        {
          value: OutDeliveryStatus.CANCELLED,
          color: Color.ERROR,
        },
      ],
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
};

import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { SOA_STATUSES, SoaStatus } from '@app/core/enums/soa-status.enum';

export const SOA_CONFIG = {
  tableFilters: {
    searchPlaceHolder: 'Search SOA',
    searchIcon: 'search',
    statuses: ['All', ...SOA_STATUSES],
  },
  tableColumns: [
    {
      label: 'SOA No.',
      dotNotationPath: 'code.value',
      type: ColumnType.STRING,
    },
    {
      label: 'Customer',
      dotNotationPath: '_customerId.name',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          value: SoaStatus.PENDING,
          color: Color.DEAD,
        },
        {
          value: SoaStatus.PAID,
          color: Color.SUCCESS,
        },
        {
          value: SoaStatus.PARTIAL,
          color: Color.WARNING,
        },
        {
          value: SoaStatus.CANCELLED,
          color: Color.ERROR,
        },
      ],
    },
    {
      label: 'Total',
      dotNotationPath: 'summary.grandtotal',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Paid',
      dotNotationPath: 'payment.paid',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Date of SOA',
      dotNotationPath: 'soaDate',
      type: ColumnType.DATE,
    },

    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'Print SOA',
          icon: 'print',
          action: 'print',
          color: Color.DEAD,
        },
        {
          name: 'Edit SOA',
          action: 'edit',
          icon: 'edit',
          color: Color.WARNING,
        },
        {
          name: 'View Payment',
          action: 'payments',
          icon: 'money',
          color: Color.SUCCESS,
        },
      ],
    },
  ],
};
import { ColumnType } from '@app/core/enums/column-type.enum';

export const WAREHOUSE_STOCK_HISTORY_CONFIG = {
  tableColumns: [
    {
      label: 'SKU',
      dotNotationPath: 'sku',
      type: ColumnType.STRING,
    },
    {
      label: 'Serial Number',
      dotNotationPath: 'serialNumber',
      type: ColumnType.STRING,
    },
    {
      label: 'Qty.',
      dotNotationPath: 'quantity',
      type: ColumnType.STRING,
    },
    {
      label: 'From',
      dotNotationPath: '_fromWarehouseId.name',
      type: ColumnType.STRING,
      valueIfEmpty: 'NO WAREHOUSE',
    },
    {
      label: 'To',
      dotNotationPath: '_toWarehouseId.name',
      type: ColumnType.STRING,
      valueIfEmpty: 'NO WAREHOUSE',
    },
    {
      label: 'Transferred By',
      dotNotationPath: 'createdBy.name',
      type: ColumnType.STRING,
    },
    {
      label: 'Date',
      dotNotationPath: 'createdAt',
      type: ColumnType.DATE,
    },
  ],
};

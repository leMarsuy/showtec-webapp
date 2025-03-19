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
      dotNotationPath: '_customerId',
      type: ColumnType.CUSTOM,
      display: (element: any) => {
        const customer = element?._customerId;
        const customerName = `<p class="font-medium">${customer.name}</p>`;

        if (customer.name !== customer.contactPerson) {
          return (
            customerName +
            `
            <p class="text-xs">${customer.contactPerson}</p>
          `
          );
        }
        return customerName;
      },
    },
    {
      label: 'No. of Items',
      dotNotationPath: 'items',
      type: ColumnType.CUSTOM,
      display: (element: any) => {
        const totalQuantity = element.items.length;
        const itemSummary = element.itemSummary;

        const initialDisplay = `<p class="font-medium">${totalQuantity} ${totalQuantity > 1 ? 'items' : 'item'}</p>`;

        if (itemSummary) {
          const itemSummaryText = Object.entries(itemSummary)
            .map(([key, value]) => `${value} ${key}`)
            .join(', ');

          return `
            <div class="py-1">
                ${initialDisplay}
                <p class="text-xs">${itemSummaryText}</p>
            </div>`;
        }

        return initialDisplay;
      },
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
          value: OutDeliveryStatus.DELIVERED,
          color: Color.SUCCESS,
        },
        {
          value: OutDeliveryStatus.PENDING,
          color: Color.INFO,
        },
        {
          value: OutDeliveryStatus.RELEASED,
          color: Color.INFO,
        },
        {
          value: OutDeliveryStatus.CANCELLED,
          color: Color.ERROR,
        },
      ],
    },
    {
      label: 'Cancelled Date',
      dotNotationPath: 'canceledAt',
      type: ColumnType.DATE,
      valueIfEmpty: '-',
    },
    {
      label: 'Cancelled Remarks',
      dotNotationPath: 'canceledRemarks',
      type: ColumnType.STRING,
      valueIfEmpty: '-',
    },
    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      align: Alignment.CENTER,
      actions: [
        {
          name: 'Print Delivery',
          icon: 'print',
          action: 'print',
          color: Color.DEAD,
        },
        {
          name: 'Edit Delivery',
          icon: 'edit',
          action: 'edit',
          color: Color.WARNING,
          showIfCondition: {
            $or: [
              { status: OutDeliveryStatus.ACTIVE },
              { status: OutDeliveryStatus.PENDING },
              { status: OutDeliveryStatus.RELEASED },
              { status: OutDeliveryStatus.DELIVERED },
            ],
          },
        },
        {
          name: 'Mark Delivered',
          icon: 'task',
          action: 'delivered',
          color: Color.INFO,
          showIfCondition: {
            $or: [
              { status: OutDeliveryStatus.PENDING },
              { status: OutDeliveryStatus.RELEASED },
            ],
          },
        },
        {
          name: 'Cancel/Return Delivery',
          icon: 'block',
          action: 'change-status-cancel',
          color: Color.ERROR,
          showIfCondition: {
            $or: [
              { status: OutDeliveryStatus.ACTIVE },
              { status: OutDeliveryStatus.PENDING },
              { status: OutDeliveryStatus.RELEASED },
              { status: OutDeliveryStatus.DELIVERED },
            ],
          },
        },
        {
          name: 'Reuse Delivery',
          icon: 'content_copy',
          action: 'clone',
          color: Color.INFO,
          showIfCondition: {
            $or: [
              { status: OutDeliveryStatus.CANCELLED },
              { status: OutDeliveryStatus.DELETED },
            ],
          },
        },
      ],
    },
  ],
};

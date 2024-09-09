import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import {
  PAYMENT_STATUSES,
  PaymentStatus,
} from '@app/core/enums/payment-status.enum';

export const EXPENSES_CONFIG = {
  headerActions: [
    {
      id: 'add',
      label: 'Add Expense',
      icon: 'add',
    },
  ],
  loadingExpenseTitle: 'Please Wait',
  loadingExpenseMsg: 'Fetching expenses...',
  tableFilters: {
    searchPlaceHolder: 'Search Expense',
    searchIcon: 'search',
    statuses: ['All', ...PAYMENT_STATUSES],
  },
  tableColumns: [
    {
      label: 'Purpose',
      dotNotationPath: 'purpose',
      type: ColumnType.STRING,
    },
    // {
    //   label: 'Ref. No.',
    //   dotNotationPath: 'refNo',
    //   type: ColumnType.STRING,
    // },
    // {
    //   label: 'Check No.',
    //   dotNotationPath: 'checkNo',
    //   type: ColumnType.STRING,
    // },
    {
      label: 'Payee',
      dotNotationPath: 'payee',
      type: ColumnType.STRING,
    },
    {
      label: 'Bank',
      dotNotationPath: 'bank',
      type: ColumnType.STRING,
    },
    {
      label: 'Payment Method',
      dotNotationPath: 'paymentMethod',
      type: ColumnType.STRING,
    },
    {
      label: 'Amount',
      dotNotationPath: 'amount',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STATUS,
      colorCodes: [
        {
          color: Color.SUCCESS,
          value: PaymentStatus.COMPLETED,
        },
        {
          color: Color.DEAD,
          value: PaymentStatus.CANCELED,
        },
        {
          color: Color.ERROR,
          value: PaymentStatus.FAILED,
        },
        {
          color: Color.WARNING,
          value: PaymentStatus.PENDING,
        },
      ],
    },
  ],
  dialogProps: {
    createDialog: {
      title: 'Create Expense',
      confirmationDialog: {
        title: 'Create Expense Confirmation',
        message: 'Are you sure you want to create this expense?',
      },
      loadingTitle: 'CreateData',
      loadingMessage: 'Adding expense to the list...',
      buttonConfirm: 'Add Expense',
    },
    updateDialog: {
      title: 'Update Expense',
      confirmationDialog: {
        title: 'Update Expense Confirmation',
        message: 'Are you sure you want to update this expense?',
      },
      loadingTitle: 'UpdateData',
      loadingMessage: 'Updating expense to the list...',
      buttonConfirm: 'Update Expense',
    },
  },
};

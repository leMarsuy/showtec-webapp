import { NavIcon } from '../enums/nav-icons.enum';

export const NAV_ROUTES = [
  {
    group: 'Home',
    items: [
      // {
      //   name: 'Dashboard',
      //   path: 'dashboard',
      //   icon: 'dashboard',
      // },
      {
        name: 'Reports',
        path: 'reports/sales',
        icon: NavIcon.REPORTS,
      },
    ],
  },
  {
    group: 'Inventory',
    items: [
      {
        name: 'Products',
        path: 'products',
        icon: NavIcon.PRODUCTS,
      },
      {
        name: 'Delivery Receipt',
        path: 'out-delivery',
        icon: NavIcon.DELIVERY_RECEIPT,
      },
    ],
  },
  {
    group: 'Sales',
    items: [
      {
        name: 'Purchase Order',
        path: 'purchase-order',
        icon: NavIcon.PURCHASE_ORDER,
      },
      {
        name: 'SOA',
        path: 'soa',
        icon: NavIcon.SOA,
      },
      // {
      //   name: 'Reports',
      //   path: 'reports/sales',
      //   icon: 'summarize',
      // },
      // {
      //   name: 'Returns',
      //   path: 'suppliers',
      //   icon: 'undo',
      // },
      // {
      //   name: 'Expenses',
      //   path: 'expenses',
      //   icon: 'toll',
      // },
      {
        name: 'Vouchers',
        path: 'vouchers',
        icon: NavIcon.VOUCHERS,
      },
    ],
  },
  {
    group: 'Address Book',
    items: [
      {
        name: 'Customers',
        path: 'customers',
        icon: NavIcon.CUSTOMERS,
      },
      {
        name: 'Payees',
        path: 'payees',
        icon: NavIcon.PAYEES,
      },
      {
        name: 'Warehouses',
        path: 'warehouses',
        icon: NavIcon.WAREHOUSES,
      },
      {
        name: 'Suppliers',
        path: 'suppliers',
        icon: NavIcon.SUPPLIERS,
      },
    ],
  },
  {
    group: 'System Management',
    items: [
      {
        name: 'Users',
        path: 'users',
        icon: NavIcon.USERS,
      },
    ],
  },
];

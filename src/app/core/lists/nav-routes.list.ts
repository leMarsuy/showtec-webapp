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
        name: 'Purchase Orders',
        path: 'purchase-order',
        icon: NavIcon.PURCHASE_ORDER,
      },
      {
        name: 'Statement of Accounts',
        path: 'soa',
        icon: NavIcon.SOA,
      },
      {
        name: 'Transactions',
        path: 'transactions',
        icon: NavIcon.TRANSACTIONS,
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
      {
        name: 'Settings',
        path: 'settings',
        icon: NavIcon.SETTINGS,
      },
    ],
  },
];

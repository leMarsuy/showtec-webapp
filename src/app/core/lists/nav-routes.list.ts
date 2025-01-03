import { NavIcon } from '../enums/nav-icons.enum';

export interface NavRoute {
  name: string;
  path: string;
  icon: NavIcon;
}

export interface NavRouteGroup {
  group: string;
  items: NavRoute[];
}

export const NAV_ROUTES: NavRouteGroup[] = [
  {
    group: 'Home',
    items: [
      // {
      //   name: 'Dashboard',
      //   path: 'dashboard',
      //   icon: 'dashboard',
      // },
      {
        name: 'Stock Checker',
        path: '/stock-checker',
        icon: NavIcon.STOCK_CHECKER,
      },
      {
        name: 'Reports',
        path: 'reports',
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
        path: 'out-deliveries',
        icon: NavIcon.DELIVERY_RECEIPT,
      },
    ],
  },
  {
    group: 'Sales',
    items: [
      {
        name: 'Purchase Order',
        path: 'purchase-orders',
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
        name: 'Roles',
        path: 'roles',
        icon: NavIcon.ROLES,
      },
      {
        name: 'Settings',
        path: 'settings',
        icon: NavIcon.SETTINGS,
      },
    ],
  },
];
import { PATHS } from '../constants/nav-paths';
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
        path: `/${PATHS.stockChecker.baseUrl}`,
        icon: NavIcon.STOCK_CHECKER,
      },
      {
        name: 'Reports',
        path: PATHS.portal.reports.baseUrl,
        icon: NavIcon.REPORTS,
      },
    ],
  },
  {
    group: 'Inventory',
    items: [
      {
        name: 'Products',
        path: PATHS.portal.products.baseUrl,
        icon: NavIcon.PRODUCTS,
      },
      {
        name: 'Delivery Receipt',
        path: PATHS.portal.deliveryReceipts.baseUrl,
        icon: NavIcon.DELIVERY_RECEIPT,
      },
    ],
  },
  {
    group: 'Sales',
    items: [
      {
        name: 'Purchase Order',
        path: PATHS.portal.purchaseOrders.baseUrl,
        icon: NavIcon.PURCHASE_ORDER,
      },
      {
        name: 'Statement of Accounts',
        path: PATHS.portal.soas.baseUrl,
        icon: NavIcon.SOA,
      },
      {
        name: 'Transactions',
        path: PATHS.portal.transactions.baseUrl,
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
        path: PATHS.portal.vouchers.baseUrl,
        icon: NavIcon.VOUCHERS,
      },
    ],
  },
  {
    group: 'Address Book',
    items: [
      {
        name: 'Customers',
        path: PATHS.portal.customers.baseUrl,
        icon: NavIcon.CUSTOMERS,
      },
      {
        name: 'Warehouses',
        path: PATHS.portal.warehouses.baseUrl,
        icon: NavIcon.WAREHOUSES,
      },
      {
        name: 'Suppliers',
        path: PATHS.portal.suppliers.baseUrl,
        icon: NavIcon.SUPPLIERS,
      },
    ],
  },
  {
    group: 'System Management',
    items: [
      {
        name: 'Users',
        path: PATHS.portal.users.baseUrl,
        icon: NavIcon.USERS,
      },
      {
        name: 'Roles',
        path: PATHS.portal.roles.baseUrl,
        icon: NavIcon.ROLES,
      },
      {
        name: 'Settings',
        path: PATHS.portal.settings.baseUrl,
        icon: NavIcon.SETTINGS,
      },
    ],
  },
];

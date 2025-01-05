import { NavIcon } from '../enums/nav-icons.enum';

export const AUTH_PATHS = {
  baseUrl: 'auth',
  login: {
    baseUrl: 'login',
    relativeUrl: 'auth/login',
  },
  register: {
    baseUrl: 'register',
    relativeUrl: 'auth/register',
  },
  forgotPassword: {
    baseUrl: 'forgot-password',
    relativeUrl: 'auth/forgot-password',
  },
};

export const PORTAL_PATHS = {
  baseUrl: 'portal',
  dashboard: {
    baseUrl: 'dashboard',
    relativeUrl: 'portal/dashboard',
  },
  reports: {
    baseUrl: 'reports',
    relativeUrl: 'portal/reports',
    sales: {
      baseUrl: 'sales',
      relativeUrl: 'portal/reports/sales',
    },
  },
  customers: {
    baseUrl: 'customers',
    relativeUrl: 'portal/customers',
  },
  deliveryReceipts: {
    baseUrl: 'out-deliveries',
    relativeUrl: 'portal/out-deliveries',
    createUrl: 'portal/out-deliveries/create',
    editUrl: 'portal/out-deliveries/edit',
  },
  products: {
    baseUrl: 'products',
    relativeUrl: 'portal/products',
  },
  purchaseOrders: {
    baseUrl: 'purchase-orders',
    relativeUrl: 'portal/purchase-orders',
    createUrl: 'portal/purchase-orders/create',
    editUrl: 'portal/purchase-orders/edit',
  },
  roles: {
    baseUrl: 'roles',
    relativeUrl: 'portal/roles',
    listUrl: 'portal/roles/list',
  },
  settings: {
    baseUrl: 'settings',
    relativeUrl: 'portal/settings',
    account: {
      baseUrl: 'account',
      relativeUrl: 'portal/settings/account',
    },
    product: {
      baseUrl: 'product',
      relativeUrl: 'portal/settings/product',
    },
    voucher: {
      baseUrl: 'voucher',
      relativeUrl: 'portal/settings/voucher',
    },
  },
  soas: {
    baseUrl: 'soa',
    relativeUrl: 'portal/soa',
    createUrl: 'portal/soa/create',
    editUrl: 'portal/soa/edit',
  },
  suppliers: {
    baseUrl: 'suppliers',
    relativeUrl: 'portal/suppliers',
  },
  transactions: {
    baseUrl: 'transactions',
    relativeUrl: 'portal/transactions',
  },
  users: {
    baseUrl: 'users',
    relativeUrl: 'portal/users',
  },
  vouchers: {
    baseUrl: 'vouchers',
    relativeUrl: 'portal/vouchers',
    createUrl: 'portal/vouchers/create',
    editUrl: 'portal/vouchers/edit',
  },
  warehouses: {
    baseUrl: 'warehouses',
    relativeUrl: 'portal/warehouses',
  },
};

export const PATHS = {
  auth: AUTH_PATHS,
  portal: PORTAL_PATHS,
  stockChecker: {
    baseUrl: 'stock-checker',
  },
  customerRegistration: {
    baseUrl: 'customer-registration',
  },
};

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
        path: '/' + PATHS.stockChecker.baseUrl,
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

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

export const RELEASING_PATHS = {
  baseUrl: 'releasing',
  auth: {
    baseUrl: 'auth',
    relativeUrl: 'releasing/auth',
  },
  portal: {
    baseUrl: 'portal',
    relativeUrl: 'releasing/portal',
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

export const EXCLUDED_PATHS = [
  `/${PATHS.stockChecker.baseUrl}`,
  `/${RELEASING_PATHS.baseUrl}`,
];

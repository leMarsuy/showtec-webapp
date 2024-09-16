export const NAV_ROUTES = [
  {
    group: 'Home',
    items: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        icon: 'dashboard',
      },
    ],
  },
  {
    group: 'Inventory',
    items: [
      {
        name: 'Products',
        path: 'products',
        icon: 'inventory_2',
      },
      {
        name: 'Delivery Receipt',
        path: 'out-delivery',
        icon: 'local_shipping',
      },
    ],
  },
  {
    group: 'Sales',
    items: [
      {
        name: 'SOA',
        path: 'soa',
        icon: 'article',
      },
      {
        name: 'Reports',
        path: 'reports/sales',
        icon: 'summarize',
      },
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
        icon: 'newspaper',
      },
    ],
  },
  {
    group: 'Address Book',
    items: [
      {
        name: 'Customers',
        path: 'customers',
        icon: 'group',
      },
      {
        name: 'Warehouses',
        path: 'warehouses',
        icon: 'warehouses',
      },
      {
        name: 'Suppliers',
        path: 'suppliers',
        icon: 'conveyor_belt',
      },
    ],
  },
  {
    group: 'System Management',
    items: [
      {
        name: 'Users',
        path: 'users',
        icon: 'person',
      },
    ],
  },
];

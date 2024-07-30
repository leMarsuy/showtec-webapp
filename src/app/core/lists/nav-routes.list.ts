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
      // {
      //   name: 'Orders',
      //   path: 'orders',
      //   icon: 'receipt_long',
      // },
      // {
      //   name: 'Returns',
      //   path: 'suppliers',
      //   icon: 'undo',
      // },
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

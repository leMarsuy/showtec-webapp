export const mock = [
  {
    name: 'Warehouse Alpha',
    id: 'wh_1a2b3c',
    stocks: [
      {
        id: 'stock_a1b2c3',
        serialNumber: 'SN001',
        model: 'TEST',
        scanDate: '2024-02-10',
        purchaseDate: '2024-01-15',
        purchaseCode: 1001,
        status: 'In Stock',
        type: 'Sealed',
        supplierId: 'SUP001',
        warehouseId: 'wh_1a2b3c',
      },
      {
        id: 'stock_d4e5f6',
        serialNumber: 'SN002',
        model: 'TEST',
        scanDate: '2024-02-11',
        purchaseDate: '2024-01-16',
        purchaseCode: 1002,
        status: 'In Stock',
        type: 'Demo',
        supplierId: 'SUP002',
        warehouseId: 'wh_1a2b3c',
      },
    ],
  },
  {
    name: 'Warehouse Beta',
    id: 'wh_4d5e6f',
    stocks: [
      {
        id: 'stock_g7h8i9',
        serialNumber: 'SN003',
        model: 'TEST',
        scanDate: '2024-02-12',
        purchaseDate: '2024-01-17',
        purchaseCode: 1003,
        status: 'In Stock',
        type: 'Service',
        supplierId: 'SUP003',
        warehouseId: 'wh_4d5e6f',
      },
    ],
  },
  {
    name: 'Warehouse Gamma',
    id: 'wh_7g8h9i',
    stocks: [
      {
        id: 'stock_j1k2l3',
        serialNumber: 'SN004',
        model: 'TEST',
        scanDate: '2024-02-13',
        purchaseDate: '2024-01-18',
        purchaseCode: 1004,
        status: 'In Stock',
        type: 'Sealed',
        supplierId: 'SUP004',
        warehouseId: 'wh_7g8h9i',
      },
      {
        id: 'stock_m4n5o6',
        serialNumber: 'SN005',
        model: 'TEST',
        scanDate: '2024-02-14',
        purchaseDate: '2024-01-19',
        purchaseCode: 1005,
        status: 'In Stock',
        type: 'Demo',
        supplierId: 'SUP005',
        warehouseId: 'wh_7g8h9i',
      },
    ],
  },
  {
    name: 'No Warehouse',
    id: 'no-warehouse',
    stocks: [
      {
        id: 'stock_p7q8r9',
        serialNumber: 'SN006',
        model: 'TEST',
        scanDate: '2024-02-15',
        purchaseDate: '2024-01-20',
        purchaseCode: 1006,
        status: 'In Stock',
        type: 'Service',
        supplierId: 'SUP006',
        warehouseId: '',
      },
    ],
  },
];

export const mockObj = {
  wh_1a2b3c: {
    name: 'Warehouse Alpha',
    stocks: [
      {
        id: 'stock_a1b2c3',
        serialNumber: 'SN001',
        model: 'ACME (CA-EN28) CARDBOARD (5PIN VERSION)',
        scanDate: '2024-02-10',
        purchaseDate: '2024-01-15',
        purchaseCode: 1001,
        status: 'In Stock',
        type: 'Sealed',
        supplierId: 'SUP001',
        warehouseId: 'wh_1a2b3c',
      },
      {
        id: 'stock_d4e5f6',
        serialNumber: 'SN002',
        model: 'TEST',
        scanDate: '2024-02-11',
        purchaseDate: '2024-01-16',
        purchaseCode: 1002,
        status: 'In Stock',
        type: 'Demo',
        supplierId: 'SUP002',
        warehouseId: 'wh_1a2b3c',
      },
    ],
  },
  wh_4d5e6f: {
    name: 'Warehouse Beta',
    stocks: [
      {
        id: 'stock_g7h8i9',
        serialNumber: 'SN003',
        model: 'TEST',
        scanDate: '2024-02-12',
        purchaseDate: '2024-01-17',
        purchaseCode: 1003,
        status: 'In Stock',
        type: 'Service',
        supplierId: 'SUP003',
        warehouseId: 'wh_4d5e6f',
      },
    ],
  },
  wh_7g8h9i: {
    name: 'Warehouse Gamma',
    stocks: [
      {
        id: 'stock_j1k2l3',
        serialNumber: 'SN004',
        model: 'TEST',
        scanDate: '2024-02-13',
        purchaseDate: '2024-01-18',
        purchaseCode: 1004,
        status: 'In Stock',
        type: 'Sealed',
        supplierId: 'SUP004',
        warehouseId: 'wh_7g8h9i',
      },
      {
        id: 'stock_m4n5o6',
        serialNumber: 'SN005',
        model: 'TEST',
        scanDate: '2024-02-14',
        purchaseDate: '2024-01-19',
        purchaseCode: 1005,
        status: 'In Stock',
        type: 'Demo',
        supplierId: 'SUP005',
        warehouseId: 'wh_7g8h9i',
      },
    ],
  },
  'no-warehouse': {
    name: 'No Warehouse',
    stocks: [
      {
        id: 'stock_p7q8r9',
        serialNumber: 'SN006',
        model: 'TEST',
        scanDate: '2024-02-15',
        purchaseDate: '2024-01-20',
        purchaseCode: 1006,
        status: 'In Stock',
        type: 'Service',
        supplierId: 'SUP006',
        warehouseId: '',
      },
    ],
  },
};

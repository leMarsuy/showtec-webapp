export enum StockStatus {
  IN_STOCK = 'In Stock',
  // FOR_PURCHASE = 'For Purchase',
  FOR_DELIVERY = 'For Delivery',
  // IN_TRANSIT = 'In Transit',
  // RECEIVED = 'Received',
  RETURNED = 'Returned',
  // FOR_REPAIR = 'For Repair',
  // FOR_LOAN = 'For Loan',
}

export const STOCK_STATUSES = Object.values(StockStatus);

export enum PurchaseOrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
  PARTIAL = 'Partial',
  ACTIVE = 'Active',
}

export const PURCHASE_ORDER_STATUSES = Object.values(PurchaseOrderStatus);

export enum PurchaseOrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
  PARTIAL = 'Partial',
}

export const PURCHASE_ORDER_STATUSES = Object.values(PurchaseOrderStatus);

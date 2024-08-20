export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  // REFUNDED = 'Refunded',
  CANCELED = 'Canceled',
}

export const PAYMENT_STATUSES = Object.values(PaymentStatus);

export enum SoaStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
  PARTIAL = 'Partial',
}

export const SOA_STATUSES = Object.values(SoaStatus);

export enum VoucherStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  RELEASE = 'Release',
  CANCELLED = 'Cancelled',
  LIQUIDATED = 'Liquidated',
  DELETED = 'Deleted',
}

export const VOUCHER_STATUSES = Object.values(VoucherStatus);

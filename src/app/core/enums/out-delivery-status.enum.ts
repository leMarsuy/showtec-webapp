export enum OutDeliveryStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DELETED = 'Deleted',
  CANCELLED = 'Cancelled',
  PENDING = 'Pending',
}

export const OUT_DELIVERY_STATUS_TYPES = Object.values(OutDeliveryStatus);

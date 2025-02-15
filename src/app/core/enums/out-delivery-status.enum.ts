export enum OutDeliveryStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DELETED = 'Deleted',
  CANCELLED = 'Cancelled',
  RELEASED = 'Released',
  PENDING = 'Pending',
  DELIVERED = 'Delivered',
}

export const OUT_DELIVERY_STATUS_TYPES = Object.values(OutDeliveryStatus);

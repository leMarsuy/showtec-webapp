export enum PaymentMethod {
  CASH = 'Cash',
  BANK_TRANSFER = 'Bank Transfer',
  CHECK = 'Check',
  // CREDIT_CARD = 'Credit Card',
  // OTHERS = 'Others',
}

export const PAYMENT_METHODS = Object.values(PaymentMethod);
export const EXPENSE_PAYMENT_METHODS = [
  PaymentMethod.BANK_TRANSFER,
  PaymentMethod.CHECK,
];

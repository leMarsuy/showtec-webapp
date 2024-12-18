import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export class Transaction {
  _id?: string;
  code?: {
    sequence: number;
    year: number;
    month: number;
    value: string;
  };
  soaId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  remarks?: string;
  status: PaymentStatus;
  referenceNo?: string;
  issuingBank?: string;
  checkNo?: string;
  accountName?: string;
  accountNo?: string;
  depositedDate?: Date | string | null;
  bank?: string;

  constructor(model: Transaction) {
    this._id = model._id;
    this.code = model.code;
    this.soaId = model.soaId;
    this.amount = model.amount;
    this.paymentMethod = model.paymentMethod;
    this.paymentDate = model.paymentDate;
    this.remarks = model.remarks;
    this.status = model.status;
    this.referenceNo = model.referenceNo;
    this.issuingBank = model.issuingBank;
    this.checkNo = model.checkNo;
    this.accountName = model.accountName;
    this.accountNo = model.accountNo;
    this.depositedDate = model.depositedDate;
    this.bank = model.bank;
  }
}

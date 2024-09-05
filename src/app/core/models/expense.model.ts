import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export class Expense {
  _id?: string;
  paymentMethod: PaymentMethod;
  bank: string;
  paymentDate: string;
  refNo: string;
  checkNo: string;
  payee: string;
  purpose: string;
  description: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;

  constructor(model: Expense) {
    this._id = model._id;
    this.paymentMethod = model.paymentMethod;
    this.bank = model.bank;
    this.paymentDate = model.paymentDate;
    this.refNo = model.refNo;
    this.checkNo = model.checkNo;
    this.payee = model.payee;
    this.purpose = model.purpose;
    this.description = model.description;
    this.amount = model.amount;
    this.status = model.status;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}

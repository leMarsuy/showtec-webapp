import { RegisteredBank } from '../enums/registered-bank.enum';
import { VoucherAccountType } from '../enums/voucher-account-type';
import { VoucherStatus } from '../enums/voucher-status.enum';
import { Signatory } from './out-delivery.model';

export interface VoucherAccount {
  title: string;
  category: string;
  remarks: string;
  amount: number;
  type: VoucherAccountType;
}

export interface VoucherParticular {
  description: string;
  amount: number;
}

export class Voucher {
  _id?: string;
  code?: {
    sequence: number;
    year: number;
    month: number;
    value: string;
  };
  signatories: Signatory[];
  accounts: VoucherAccount[];
  particulars: VoucherParticular[];
  bank: RegisteredBank;
  specificBank?: string;
  status: VoucherStatus;
  payee: string;
  accountsTotal: number;
  checkDate: string;
  checkNo: string;

  constructor(model: Voucher) {
    this._id = model._id;
    this.code = model.code;
    this.signatories = model.signatories;
    this.accounts = model.accounts;
    this.bank = model.bank;
    this.specificBank = model.specificBank;
    this.status = model.status;
    this.payee = model.payee;
    this.accountsTotal = model.accountsTotal;
    this.particulars = model.particulars;
    this.checkDate = model.checkDate;
    this.checkNo = model.checkNo;
  }
}

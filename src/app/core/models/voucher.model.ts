import { RegisteredBank } from '../enums/registered-bank.enum';
import { Status } from '../enums/status.enum';
import { VoucherAccountType } from '../enums/voucher-account-type';
import { Signatory } from './out-delivery.model';

export interface VoucherAccount {
  title: string;
  category: string;
  remarks: string;
  amount: string;
  type: VoucherAccountType;
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
  bank: RegisteredBank;
  status: Status;
  payee: string;
  accountsTotal: number;

  constructor(model: Voucher) {
    this._id = model._id;
    this.code = model.code;
    this.signatories = model.signatories;
    this.accounts = model.accounts;
    this.bank = model.bank;
    this.status = model.status;
    this.payee = model.payee;
    this.accountsTotal = model.accountsTotal;
  }
}

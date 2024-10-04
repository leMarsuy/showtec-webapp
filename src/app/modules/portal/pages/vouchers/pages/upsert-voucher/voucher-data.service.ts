import { Injectable } from '@angular/core';
import { Signatory } from '@app/core/models/out-delivery.model';
import {
  Voucher,
  VoucherAccount,
  VoucherParticular,
} from '@app/core/models/voucher.model';

interface ReuseVoucher {
  payee: string;
  bank: string;
  accounts: Partial<VoucherAccount>[];
  particulars: Partial<VoucherParticular>[];
  signatories: Signatory[];
}

@Injectable({
  providedIn: 'root',
})
export class VoucherDataService {
  private voucher: ReuseVoucher | null = null;

  get Voucher() {
    const clone = this.voucher;
    this.deleteVoucher();
    return clone;
  }

  constructor() {}

  setVoucher(voucher: Voucher) {
    this.voucher = this.formatVoucherForReuse(voucher);
  }

  deleteVoucher() {
    this.voucher = null;
  }

  private formatVoucherForReuse(voucher: Voucher) {
    const accounts = voucher.accounts.map((account: VoucherAccount) => {
      return {
        title: account.title,
        category: account.category,
        remarks: account.remarks,
        type: account.type,
        amount: undefined,
      };
    });

    const particulars = voucher.particulars.map(
      (particular: VoucherParticular) => {
        return {
          description: particular.description,
          amount: undefined,
        };
      }
    );

    return {
      payee: voucher.payee,
      bank: voucher.bank,
      signatories: voucher.signatories,
      particulars,
      accounts,
    };
  }
}

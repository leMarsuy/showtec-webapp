import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { ACCOUNT_CATEGORIES, AccountCategory } from './account-categories.list';
import { ACCOUNT_TITLES, AccountTitle } from './account-title.list';
import { REGISTERED_BANKS } from '@app/core/enums/registered-bank.enum';

@Component({
  selector: 'app-upsert-voucher',
  templateUrl: './upsert-voucher.component.html',
  styleUrl: './upsert-voucher.component.scss',
})
export class UpsertVoucherComponent implements OnInit, OnDestroy {
  voucherForm: FormGroup;

  banks: Array<String>;

  private _destroyed$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
    this.voucherForm = this.formBuilder.group({
      payee: ['', Validators.required],
      bank: ['', Validators.required],
      accountsTotal: [''],
      accounts: this.formBuilder.array([]),
    });

    this.banks = REGISTERED_BANKS.map((bank) => bank.toUpperCase());
  }

  get accountsFormArray(): FormArray<FormGroup> {
    return this.voucherForm.get('accounts') as FormArray<FormGroup>;
  }

  ngOnInit() {}

  navigateBack() {
    this.router.navigate(['portal/vouchers']);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

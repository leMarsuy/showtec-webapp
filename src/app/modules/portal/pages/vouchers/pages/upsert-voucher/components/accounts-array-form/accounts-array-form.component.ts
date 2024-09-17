import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, startWith, Subject, takeUntil } from 'rxjs';
import { ACCOUNT_TITLES, AccountTitle } from '../../account-title.list';
import {
  VOUCHER_ACCOUNT_TYPES,
  VoucherAccountType,
} from '@app/core/enums/voucher-account-type';

@Component({
  selector: 'app-accounts-array-form',
  templateUrl: './accounts-array-form.component.html',
  styleUrl: './accounts-array-form.component.scss',
})
export class AccountsArrayFormComponent implements OnInit, OnDestroy {
  @Input() title!: string;
  @Input({ required: true }) fArray!: FormArray;
  @Input() defaultValueArray!: Array<any> | null;

  accountType = VOUCHER_ACCOUNT_TYPES;

  private _destroyed$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.defaultValueArray) {
      for (const row of this.defaultValueArray) {
        this.addRow(row);
      }
    } else this.addRow();
  }

  addRow(row?: any) {
    const formGroup = this.formBuilder.group({
      category: [row?.category || '', Validators.required],
      title: [row?.title || '', Validators.required],
      remarks: [row?.remarks || ''],
      amount: [row?.amount || '', Validators.required],
      type: [row?.type || VoucherAccountType.DEBIT, Validators.required],
      titleOptions: [ACCOUNT_TITLES],
      search: [
        row
          ? {
              name: row?.title || '',
              category: row?.category || '',
            }
          : '',
      ],
    });

    formGroup
      .get('search')
      ?.valueChanges.pipe(
        takeUntil(this._destroyed$),
        startWith(''),
        debounceTime(300)
      )
      .subscribe((searchControl: any) => {
        if (typeof searchControl === 'object') {
          formGroup.get('category')?.setValue(searchControl.category);
          formGroup.get('title')?.setValue(searchControl.name);
        } else {
          let titles: AccountTitle[];
          if (!searchControl) {
            titles = ACCOUNT_TITLES;
          } else {
            titles = this._filterTitles(searchControl);
          }

          formGroup.get('titleOptions')?.setValue(titles);
        }
      });

    formGroup
      .get('search')
      ?.valueChanges.pipe(takeUntil(this._destroyed$))
      .subscribe((value: any) => {
        if (typeof value !== 'object') {
          formGroup.get('category')?.reset();
          formGroup.get('title')?.reset();
        }
      });

    this.fArray.push(formGroup, { emitEvent: false });
  }

  removeRow(index: number) {
    this.fArray.removeAt(index);
  }

  private _filterTitles(searchKey: string) {
    const filterKey = searchKey.toLowerCase();

    return ACCOUNT_TITLES.filter((account: AccountTitle) => {
      return account.name.toLowerCase().includes(filterKey);
    });
  }

  displayFn(account: AccountTitle): string {
    return account && account.name ? account.name : '';
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  ACCOUNT_CATEGORIES,
  AccountCategory,
} from '../../account-categories.list';
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
  @Input() defaultValueArray!: Array<any>;

  titles!: Array<string>;
  categories: Array<AccountCategory>;
  categoryTitleMap!: Record<string, Array<string>>;
  accountType = VOUCHER_ACCOUNT_TYPES;

  private _destroyed$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
    this.categories = ACCOUNT_CATEGORIES.map((category) => ({
      name: category.name.toUpperCase(),
    }));
    this.categoryTitleMap = this._mapCategoryTitle(ACCOUNT_TITLES);
  }

  ngOnInit(): void {
    // this.addRow();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  addRow(row?: any) {
    const formGroup: FormGroup = this.formBuilder.group({
      category: [row?.category || '', Validators.required],
      title: [row?.title || ''],
      remarks: [row?.remarks || ''],
      amount: [row?.amount || ''],
      type: [row?.type || VoucherAccountType.DEBIT],
    });

    formGroup
      .get('category')
      ?.valueChanges.pipe(takeUntil(this._destroyed$))
      .subscribe((selectedCategory) => {
        if (!selectedCategory) this.titles = [];
        this.titles = this.categoryTitleMap[selectedCategory];
      });

    this.fArray.push(formGroup, { emitEvent: false });
  }

  removeRow(index: number) {
    this.fArray.removeAt(index);
  }

  show() {
    console.log(this.fArray);
  }

  private _mapCategoryTitle(
    titles: Array<AccountTitle>
  ): Record<string, Array<string>> {
    const mapped: any = titles.reduce(
      (acc: any, accountTitle: AccountTitle) => {
        const { category, name } = accountTitle;

        if (acc && !acc[category.toUpperCase()]) {
          acc[category.toUpperCase()] = [];
        }

        acc[category.toUpperCase()].push(name.toUpperCase());
        return acc;
      },
      {}
    );

    for (const key in mapped) {
      mapped[key].sort();
    }

    return mapped;
  }
}

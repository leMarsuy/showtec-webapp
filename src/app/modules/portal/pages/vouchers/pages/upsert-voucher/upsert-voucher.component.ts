import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { REGISTERED_BANKS } from '@app/core/enums/registered-bank.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import {
  SIGNATORY_ACTIONS,
  SignatoryAction,
} from '@app/core/enums/signatory-action.enum';
import { deepInsert } from '@app/shared/utils/deepInsert';
import { User } from '@app/core/models/user.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { VoucherApiService } from '@app/shared/services/api/voucher-api/voucher-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { Voucher } from '@app/core/models/voucher.model';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-upsert-voucher',
  templateUrl: './upsert-voucher.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './upsert-voucher.component.scss',
})
export class UpsertVoucherComponent implements OnInit, OnDestroy {
  banks: Array<String>;
  isUpdate!: boolean;

  voucher!: Voucher;
  voucherForm!: FormGroup;
  voucherId!: string;

  loading = true;

  /**
   * * SIGNATORIES
   */
  signatoryControl = new FormControl('');
  filteredSignatories!: Observable<User[]>;
  listedSignatories: Array<any> = [];
  listedSignatoriesColumns: TableColumn[] = [
    {
      label: 'Name',
      dotNotationPath: 'name',
      type: ColumnType.STRING,
    },
    {
      label: 'Designation',
      dotNotationPath: 'designation',
      type: ColumnType.STRING,
    },
    {
      label: 'Action',
      dotNotationPath: 'action',
      type: ColumnType.STRING,
      editable: true,
      options: SIGNATORY_ACTIONS,
      width: '[20rem]',
    },
    {
      label: 'Remove',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: '[2rem]',
      actions: [{ icon: 'remove', name: 'remove', color: Color.ERROR }],
    },
  ];
  listedSignatoriesPage: PageEvent = {
    pageIndex: 0,
    pageSize: 100,
    length: 0,
  };

  private _destroyed$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userApi: UserApiService,
    private voucherApi: VoucherApiService,
    private confirmation: ConfirmationService,
    private snackbarService: SnackbarService
  ) {
    this.banks = REGISTERED_BANKS;
    this.voucherForm = this.formBuilder.group({
      payee: ['', Validators.required],
      bank: ['', Validators.required],
      accountsTotal: ['', Validators.required],
      accounts: this.formBuilder.array([]),
      particulars: this.formBuilder.array([]),
      checkNo: ['', Validators.required],
      checkDate: [null, Validators.required],
    });
    this.voucherId = this.route.snapshot.paramMap.get('_id') || '';
    this.isUpdate = this.voucherId ? true : false;

    if (this.voucherId) {
      this._getVoucherById(this.voucherId);
    } else {
      this.loading = false;
    }
  }

  get isVoucherFormValid(): boolean {
    return (
      this.voucherForm.valid &&
      this.listedSignatories.length !== 0 &&
      this.voucherForm.get('accounts')?.value.length !== 0 &&
      this.voucherForm.get('particulars')?.value.length !== 0
    );
  }

  ngOnInit() {
    this.filteredSignatories = this.signatoryControl.valueChanges.pipe(
      takeUntil(this._destroyed$),
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterSignatories(val || '');
      })
    );
  }

  actionEventSignatories(e: any) {
    if (e.action.name == 'remove') {
      this.removeFromListedSignatories(e.i);
    }
  }

  removeFromListedSignatories(i: number) {
    this.listedSignatories.splice(i, 1);
    this._copySignatoriesToSelf();
  }

  updateSignatories(e: any) {
    deepInsert(e.newValue, e.column.dotNotationPath, e.element);
    this._copySignatoriesToSelf();
  }

  pushToListedSignatories(user: User) {
    this.listedSignatories.push({
      ...user,
      action: SignatoryAction.APPROVED,
    });
    this._copySignatoriesToSelf();
    this.signatoryControl.reset();
  }

  onSubmit() {
    const message = this.isUpdate ? 'updating' : 'creating';

    this.confirmation
      .open(
        'Voucher Confirmation',
        `Would you like to proceed on ${message} this <b>Voucher</b>?`
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const form = this._formatResponseBody();
          if (this.isUpdate && this.voucherId) {
            this._updateVoucher(this.voucherId, form);
            return;
          }

          this._createVoucher(form);
        }
      });
  }

  private _patchFormValues() {
    this.voucherForm.patchValue(this.voucher);
    this.voucher.signatories.forEach((sig: any) => {
      this.listedSignatories.push({
        name: sig.STATIC.name,
        designation: sig.STATIC.designation,
        action: sig.action,
        _id: sig._userId,
      });
    });

    this._copySignatoriesToSelf();
  }

  private _filterSignatories(value: string) {
    return this.userApi
      .getUsers({ searchText: value, pageSize: 5 })
      .pipe(map((response: any) => response.records));
  }

  private _copySignatoriesToSelf() {
    this.listedSignatories.sort((a, b) => {
      var aIndex = SIGNATORY_ACTIONS.findIndex((action) => action === a.action);
      var bIndex = SIGNATORY_ACTIONS.findIndex((action) => action === b.action);
      return aIndex - bIndex;
    });
    this.listedSignatories = [...this.listedSignatories];
    this.listedSignatoriesPage.length = -1;
    setTimeout(() => {
      this.listedSignatoriesPage.length = this.listedSignatories.length;
    }, 20);
  }

  private _formatResponseBody() {
    const rawVoucherForm = this.voucherForm.getRawValue() as any;

    rawVoucherForm.signatories = [];
    this.listedSignatories.forEach((signatory) => {
      rawVoucherForm.signatories.push({
        _userId: signatory._id,
        STATIC: {
          name: signatory.name,
          designation: signatory.designation,
        },
        action: signatory.action,
      });
    });

    //Cleanup Accounts Pseudo Controls
    for (const account of rawVoucherForm.accounts) {
      delete account.search;
      delete account.titleOptions;
    }

    return rawVoucherForm;
  }

  private _getVoucherById(id: string) {
    this.voucherApi.getVoucherById(id).subscribe((voucher) => {
      this.voucher = voucher as Voucher;
      this.loading = false;
      this._patchFormValues();
    });
  }

  private _createVoucher(voucher: Voucher) {
    this.voucherApi.createVoucher(voucher).subscribe({
      next: (res: any) => {
        this.snackbarService.openSuccessSnackbar(
          'Success',
          'Voucher Successfully Created.'
        );
        this.navigateBack();
        // setTimeout(() => {
        //   this.displayPDF(res);
        // }, 1400);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  private _updateVoucher(id: string, body: Voucher) {
    this.voucherApi.updateVoucherById(id, body).subscribe({
      next: (res: any) => {
        this.snackbarService.openSuccessSnackbar(
          'Success',
          'Voucher Successfully Updated.'
        );
        this.navigateBack();
        // setTimeout(() => {
        //   this.displayPDF(res);
        // }, 1400);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
        this.navigateBack();
      },
    });
  }

  navigateBack() {
    this.router.navigate(['portal/vouchers'], { skipLocationChange: true });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

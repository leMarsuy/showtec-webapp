import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { REGISTERED_BANKS } from '@app/core/enums/registered-bank.enum';
import { SignatoryAction } from '@app/core/enums/signatory-action.enum';
import { Signatory } from '@app/core/models/out-delivery.model';
import { Voucher } from '@app/core/models/voucher.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { VoucherApiService } from '@app/shared/services/api/voucher-api/voucher-api.service';
import { isEmpty } from '@app/shared/utils/objectUtil';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { VoucherConfig } from '../../../settings/pages/voucher-settings/voucher-settings.component';
import { AccountTitle } from './account-title.list';
import { VoucherDataService } from './voucher-data.service';

@Component({
  selector: 'app-upsert-voucher',
  templateUrl: './upsert-voucher.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './upsert-voucher.component.scss',
})
export class UpsertVoucherComponent implements OnInit, OnDestroy {
  private readonly configName = 'voucher';
  banks = REGISTERED_BANKS;

  accountTitles!: AccountTitle[];

  voucher!: Voucher;
  voucherForm!: FormGroup;
  voucherId!: string;

  isUpdate = false;
  isLoading = true;
  checkingCheckNo = false;

  signatoryAction = SignatoryAction.APPROVED;
  listedSignatories: Array<any> = [];

  private readonly _destroyed$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly voucherApi: VoucherApiService,
    private readonly configApi: ConfigApiService,
    private readonly voucherData: VoucherDataService,
    private readonly confirmation: ConfirmationService,
    private readonly snackbar: SnackbarService,
    private readonly dialog: MatDialog,
  ) {
    this.voucherForm = this.formBuilder.group({
      _supplierId: [''],
      payee: ['', Validators.required],
      bank: ['', Validators.required],
      specificBank: [''],
      accountsTotal: ['', Validators.required],
      accounts: this.formBuilder.array([]),
      particulars: this.formBuilder.array([]),
      checkNo: ['', Validators.required],
      checkDate: [null, Validators.required],
    });

    this.voucherForm
      .get('bank')
      ?.valueChanges.pipe(takeUntil(this._destroyed$))
      .subscribe((bank) => {
        if (bank === 'OTHERS') {
          this.voucherForm
            .get('specificBank')
            ?.setValidators(Validators.required);
        } else {
          this.voucherForm.get('specificBank')?.clearValidators();
        }
      });

    this.configApi.getConfigByName(this.configName).subscribe({
      next: (response) => {
        const config = response as VoucherConfig;
        this.accountTitles = config.data.distributionOfAccounts.accountTitles;
      },
      error: ({ error }: HttpErrorResponse) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }

  get isVoucherFormValid(): boolean {
    return (
      this.voucherForm.valid &&
      this.listedSignatories.length !== 0 &&
      this.voucherForm.get('accounts')?.value.length !== 0 &&
      this.voucherForm.get('particulars')?.value.length !== 0
    );
  }

  async ngOnInit() {
    const activateRouteData$ = this.activatedRoute.data.pipe(
      takeUntil(this._destroyed$),
    );
    const resolverResponse = await firstValueFrom(activateRouteData$);
    //Upsert Create
    if (isEmpty(resolverResponse)) {
      // const createVoucher: any = {};

      // //Get Latest Voucher
      // const getRecentVoucher$ = this.voucherApi.getRecentVoucher().pipe(
      //   takeUntil(this._destroyed$),
      //   catchError(() => of(false)),
      // );
      // const recentVoucher = (await firstValueFrom(
      //   getRecentVoucher$,
      // )) as Voucher;

      // if (recentVoucher) {
      //   const checkNo = Number(recentVoucher.checkNo);

      //   createVoucher['signatories'] = recentVoucher.signatories;

      //   if (Number.isInteger(checkNo)) {
      //     createVoucher['checkNo'] = checkNo + 1;
      //   }
      // }

      //Check if upsert create initiated by reuse voucher

      // if (voucherClone) {
      //   Object.assign(createVoucher, voucherClone);
      // }

      this.voucherForm
        .get('bank')
        ?.valueChanges.pipe(takeUntil(this._destroyed$))
        .subscribe((bank) => {
          if (!bank) return;
          if (bank === 'OTHERS') {
            this.voucherForm.get('checkNo')?.setValue('');
            return;
          }
          this.checkingCheckNo = true;
          const checkNoControl = this.voucherForm.get('checkNo');
          this.listedSignatories = [];
          checkNoControl?.setValue('');
          this.voucherApi.getRecentVoucher({ bank }).subscribe({
            next: (recentVoucher) => {
              const voucher = recentVoucher;
              if (voucher) {
                const checkNo = Number(voucher?.checkNo);
                if (Number.isInteger(checkNo)) {
                  checkNoControl?.setValue((checkNo + 1).toString());
                } else {
                  checkNoControl?.setValue(voucher.checkNo);
                }
              }

              if (voucher?.signatories?.length) {
                for (let signatory of voucher.signatories) {
                  this.listedSignatories.push({
                    name: signatory.STATIC.name,
                    designation: signatory.STATIC.designation,
                    action: signatory.action,
                    _id: signatory._userId,
                  });
                }
              }

              this.checkingCheckNo = false;
            },
            error: (err) => {
              console.error(err);
              this.checkingCheckNo = false;
            },
          });
        });
      const voucherClone = this.voucherData.Voucher as Voucher;
      this.voucher = voucherClone;
      this._patchFormValues(this.voucher);
      this.isLoading = false;
    }

    //Upsert Update
    else {
      this.isUpdate = true;
      this.voucher = resolverResponse['voucher'];
      this.voucherId = this.voucher._id as string;
      this._patchFormValues(this.voucher);
      this.isLoading = false;
    }
  }

  onPayeeChange(payee: any) {
    this.voucherForm.get('_supplierId')?.setValue(payee._id);
    this.voucherForm.get('payee')?.setValue(payee.name);
  }

  onSubmit() {
    const message = this.isUpdate ? 'updating' : 'creating';

    this.confirmation
      .open(
        'Voucher Confirmation',
        `Would you like to proceed on ${message} this <b>Voucher</b>?`,
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const form = this._formatResponseBody();

          //Update Api Call
          if (this.isUpdate && this.voucherId) {
            this._updateVoucher(this.voucherId, form);
          }
          //Create Api Call
          else {
            this._createVoucher(form);
          }
        }
      });
  }

  signatoriesEmitHandler(signatories: Signatory[]) {
    this.listedSignatories = signatories;
    this.voucherForm.markAsDirty();
  }

  private _patchFormValues(voucher: any) {
    this.voucherForm.patchValue({
      _supplierId: voucher?._supplierId ?? null,
      payee: voucher?.payee ?? '',
      bank: voucher?.bank ?? '',
      specificBank: voucher?.specificBank ?? '',
      accountsTotal: voucher?.accountsTotal ?? '',
      checkNo: voucher?.checkNo ?? '',
      checkDate: voucher?.checkDate ?? null,
      accounts: voucher?.accounts ?? [],
      particulars: voucher?.particulars ?? [],
    });

    if (Array.isArray(voucher?.signatories) && voucher.signatories.length > 0) {
      for (let signatory of voucher.signatories) {
        this.listedSignatories.push({
          name: signatory.STATIC.name,
          designation: signatory.STATIC.designation,
          action: signatory.action,
          _id: signatory._userId,
        });
      }
    }
  }

  private _formatResponseBody() {
    const rawVoucherForm = this.voucherForm.getRawValue();

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

  private _createVoucher(voucher: Voucher) {
    this.voucherApi.createVoucher(voucher).subscribe({
      next: (res: any) => {
        this.snackbar.openSuccessSnackbar(
          'Success',
          'Voucher Successfully Created.',
        );
        this._displayPDF(res);
        this.navigateBack();
      },
      error: ({ error }: HttpErrorResponse) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }

  private _updateVoucher(id: string, body: Voucher) {
    this.voucherApi.updateVoucherById(id, body).subscribe({
      next: (res: any) => {
        this.snackbar.openSuccessSnackbar(
          'Success',
          'Voucher Successfully Updated.',
        );
        this._displayPDF(res);
        this.navigateBack();
      },
      error: ({ error }: HttpErrorResponse) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        this.navigateBack();
      },
    });
  }

  private _displayPDF(voucher: Voucher) {
    if (!voucher._id) {
      this.snackbar.openErrorSnackbar('Error 404', 'Voucher ID is missing');
      return;
    }

    this.dialog.open(PdfViewerComponent, {
      data: {
        apiCall: this.voucherApi.getVoucherPdfReceipt(voucher._id),
        title: 'View Delivery Receipt',
      },
      maxWidth: '70rem',
      width: '100%',
      disableClose: true,
      autoFocus: false,
    });
  }

  navigateBack() {
    this.router.navigate([PORTAL_PATHS.vouchers.relativeUrl]);
  }

  ngOnDestroy(): void {
    this.voucherData.deleteVoucher();
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

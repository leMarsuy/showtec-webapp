import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import {
  REGISTERED_BANKS,
  RegisteredBank,
} from '@app/core/enums/registered-bank.enum';
import { SignatoryAction } from '@app/core/enums/signatory-action.enum';
import { Signatory } from '@app/core/models/out-delivery.model';
import { Voucher } from '@app/core/models/voucher.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { VoucherApiService } from '@app/shared/services/api/voucher-api/voucher-api.service';
import { isEmpty } from '@app/shared/utils/objectUtil';
import { catchError, firstValueFrom, of, Subject, takeUntil } from 'rxjs';
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
      payee: ['', Validators.required],
      bank: ['', Validators.required],
      accountsTotal: ['', Validators.required],
      accounts: this.formBuilder.array([]),
      particulars: this.formBuilder.array([]),
      checkNo: ['', Validators.required],
      checkDate: [null, Validators.required],
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
      const createVoucher: any = {};

      //Get Latest Voucher
      const getRecentVoucher$ = this.voucherApi.getRecentVoucher().pipe(
        takeUntil(this._destroyed$),
        catchError(() => of(false)),
      );
      const recentVoucher = (await firstValueFrom(
        getRecentVoucher$,
      )) as Voucher;

      if (recentVoucher) {
        const checkNo = Number(recentVoucher.checkNo);

        createVoucher['signatories'] = recentVoucher.signatories;

        if (Number.isInteger(checkNo)) {
          createVoucher['checkNo'] = checkNo + 1;
        }
      }

      //Check if upsert create initiated by reuse voucher
      const voucherClone = this.voucherData.Voucher as Voucher;
      if (voucherClone) {
        Object.assign(createVoucher, voucherClone);
      }

      this.voucher = createVoucher;
      this._patchFormValues(createVoucher);
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
      payee: voucher?.payee ?? '',
      bank: voucher?.bank ?? RegisteredBank.CHINABANK,
      accountsTotal: voucher?.accountsTotal ?? '',
      checkNo: voucher?.checkNo ?? '',
      checkDate: voucher?.checkDate ?? null,
      accounts: voucher?.accoutns ?? [],
      particulars: voucher?.particulars ?? [],
    });

    if (Array.isArray(voucher.signatories) && voucher.signatories.length > 0) {
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

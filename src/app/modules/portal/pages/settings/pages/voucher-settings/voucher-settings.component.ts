import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { catchError, Observable, of, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ObjectService } from '@app/shared/services/util/object/object.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ACCOUNT_TITLES,
  AccountTitle,
} from '../../../vouchers/pages/upsert-voucher/account-title.list';
import { ConfigApiService } from '@app/shared/services/api/config-apo/config-api.service';
import { DistributionOfAccountDataService } from './voucher-settings-data.service';

interface DistributionOfAccountsConfig {
  accountCategories: Array<string>;
  accountTitles: Array<AccountTitle>;
}

export interface VoucherConfig {
  name: string;
  data: {
    distributionOfAccounts: DistributionOfAccountsConfig;
  };
}

@Component({
  selector: 'app-voucher-settings',
  templateUrl: './voucher-settings.component.html',
  styleUrl: './voucher-settings.component.scss',
})
export class VoucherSettingsComponent implements OnInit {
  private readonly configName = 'voucher';
  config!: VoucherConfig;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly objectService: ObjectService,
    private readonly configApi: ConfigApiService,
    private readonly snackbar: SnackbarService,
    private readonly distributionOfAccountDataService: DistributionOfAccountDataService
  ) {}

  ngOnInit(): void {
    this.getVoucherConfig();
  }

  getVoucherConfig() {
    this.configApi.getConfigByName(this.configName).subscribe({
      next: (config: unknown) => {
        this.config = config as VoucherConfig;
        this._setDistributionOfAccountSettings();
      },
      error: ({ error }: HttpErrorResponse) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, 'error.message');
      },
    });
  }

  onCategoriesSettingSave() {
    const newCategories = this.distributionOfAccountDataService.getCategories();
    const newTitles = this.distributionOfAccountDataService.getTitles();
    const body: Partial<VoucherConfig> = {
      data: {
        distributionOfAccounts: {
          accountCategories: newCategories,
          accountTitles: newTitles,
        },
      },
    };

    this.snackbar.openLoadingSnackbar(
      'Saving Account Categories',
      'Please Wait...'
    );
    this.configApi.updateConfigByName(this.configName, body).subscribe({
      next: (config) => {
        this.snackbar.closeLoadingSnackbar();
        this.snackbar.openSuccessSnackbar(
          'Saving Success!',
          'Distribution of Account Categories is updated.'
        );
        this.config = config as VoucherConfig;
        this._setDistributionOfAccountSettings();
      },
      error: ({ error }: HttpErrorResponse) => {
        this.snackbar.closeLoadingSnackbar();
        console.error(error);
        this.snackbar.openErrorSnackbar(
          error.errorCode,
          error.message + `Please reload the page`
        );
      },
    });
  }

  private _setDistributionOfAccountSettings() {
    const { accountCategories, accountTitles } =
      this.config.data.distributionOfAccounts;

    this.distributionOfAccountDataService.setCategories(accountCategories);
    this.distributionOfAccountDataService.setTitles(accountTitles);
  }
}

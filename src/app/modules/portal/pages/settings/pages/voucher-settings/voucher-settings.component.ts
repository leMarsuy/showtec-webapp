import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { catchError, filter, Observable, of, Subject, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ObjectService } from '@app/shared/services/util/object/object.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ACCOUNT_TITLES,
  AccountTitle,
} from '../../../vouchers/pages/upsert-voucher/account-title.list';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { DistributionOfAccountDataService } from './voucher-settings-data.service';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';

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

  categoriesDirtyState = false;
  titlesDirtyState = false;
  isUpdate = false;

  constructor(
    private readonly configApi: ConfigApiService,
    private readonly distributionOfAccountDataService: DistributionOfAccountDataService,
    private readonly snackbar: SnackbarService,
    private readonly confirmation: ConfirmationService,
  ) {}

  get isDistributionOfAccountsDirty() {
    return this.categoriesDirtyState || this.titlesDirtyState;
  }

  ngOnInit(): void {
    this.getVoucherConfig();
  }

  getVoucherConfig() {
    this.configApi.getConfigByName(this.configName).subscribe({
      next: (config: unknown) => {
        if (!config) return;

        this.config = config as VoucherConfig;
        this.isUpdate = true;
        this._setDistributionOfAccountSettings();
      },
      error: ({ error }: HttpErrorResponse) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }

  onDistributionOfAccountSettingSave() {
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

    this.confirmation
      .open('Save Confirmation', 'Do you want to save your changes?')
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.snackbar.openLoadingSnackbar(
            'Saving Account Categories',
            'Please Wait...',
          );

          if (this.isUpdate) {
            return this.configApi.updateConfigByName(this.configName, body);
          } else {
            body.name = this.configName;
            return this.configApi.createConfig(body);
          }
        }),
      )
      .subscribe({
        next: (config) => {
          this.snackbar.closeLoadingSnackbar();
          this.snackbar.openSuccessSnackbar(
            'Saving Success!',
            'Distribution of Account Categories is updated.',
          );
          this._setDistributionOfAccountSettingsDirtyState(false);
          this.getVoucherConfig();
        },
        error: ({ error }: HttpErrorResponse) => {
          this.snackbar.closeLoadingSnackbar();
          console.error(error);
          this.snackbar.openErrorSnackbar(
            error.errorCode,
            error.message + `Please reload the page`,
          );
        },
      });
  }

  categoriesDirtyStateHandler(isDirty: boolean) {
    this.categoriesDirtyState = isDirty;
  }

  titlesDirtyStateHandler(isDirty: boolean) {
    this.titlesDirtyState = isDirty;
  }

  private _setDistributionOfAccountSettingsDirtyState(isDirty: boolean) {
    this.categoriesDirtyState = isDirty;
    this.titlesDirtyState = isDirty;
  }

  private _setDistributionOfAccountSettings() {
    const { accountCategories, accountTitles } =
      this.config.data.distributionOfAccounts;

    this.distributionOfAccountDataService.setCategories(accountCategories);
    this.distributionOfAccountDataService.setTitles(accountTitles);
  }
}

import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { ProductClassificationDataService } from './product-settings-data.service';
import { filter, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface ProductConfig {
  name: 'product';
  data: {
    productClassifications: Array<string>;
  };
}

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrl: './product-settings.component.scss',
})
export class ProductSettingsComponent implements OnInit {
  private readonly configName = 'product';
  config!: ProductConfig;

  classificationDirtyState = false;

  isUpdate = false;

  constructor(
    private readonly configApi: ConfigApiService,
    private readonly classificationDataService: ProductClassificationDataService,
    private readonly snackbar: SnackbarService,
    private readonly confirmation: ConfirmationService,
  ) {}

  get isClassificationDirty() {
    return this.classificationDirtyState;
  }

  ngOnInit(): void {
    this.getProductConfig();
  }

  getProductConfig() {
    this.configApi.getConfigByName(this.configName).subscribe({
      next: (config: unknown) => {
        if (!config) return;

        this.config = config as ProductConfig;
        this.isUpdate = true;
        this._setProductClassificationSettings();
      },
    });
  }

  onProductClassificationsSave() {
    const newClassifications =
      this.classificationDataService.getClassifications();
    const body: Partial<ProductConfig> = {
      data: {
        productClassifications: newClassifications,
      },
    };

    this.confirmation
      .open('Save Confirmation', 'Do you want to save your changes?')
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.snackbar.openLoadingSnackbar(
            'Saving Product Classifications',
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
            `Product Classifications is ${
              this.isUpdate ? 'updated' : 'created'
            }.`,
          );

          this.classificationDirtyState = false;
          this.getProductConfig();
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

  classificationDirtyStateHandler(isDirty: boolean) {
    this.classificationDirtyState = isDirty;
  }

  private _setProductClassificationSettings() {
    const classifications = this.config.data.productClassifications;
    this.classificationDataService.setClassifications(classifications);
  }
}

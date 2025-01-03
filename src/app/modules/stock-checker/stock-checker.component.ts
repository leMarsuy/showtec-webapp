import { Component, inject } from '@angular/core';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { map } from 'rxjs';
import { ProductConfig } from '../portal/pages/settings/pages/product-settings/product-settings.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { StockCheckerService } from './stock-checker.service';

@Component({
  selector: 'app-stock-checker',
  templateUrl: './stock-checker.component.html',
  styleUrl: './stock-checker.component.scss',
})
export class StockCheckerComponent {
  readonly logoSrc = 'images/logo.png';

  private readonly configApi = inject(ConfigApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly stockCheckerService = inject(StockCheckerService);
  private readonly productConfigName = 'product';

  constructor() {
    this.configApi
      .getConfigByName(this.productConfigName)
      .pipe(
        map((response) => {
          const config = response as ProductConfig;
          return config.data.productClassifications;
        }),
      )
      .subscribe({
        next: (classifications: Array<string>) => {
          this.stockCheckerService.setClassifications(classifications);
        },
        error: ({ error }: HttpErrorResponse) => {
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }
}

import { Component } from '@angular/core';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ConfigApiService } from '@app/shared/services/api/config-apo/config-api.service';

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
export class ProductSettingsComponent {
  private readonly configName = 'product';
  config!: ProductConfig;

  constructor(
    private readonly configApi: ConfigApiService,
    private readonly snackbar: SnackbarService,
    private readonly confirmation: ConfirmationService
  ) {}
}

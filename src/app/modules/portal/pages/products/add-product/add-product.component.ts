import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { Product } from '@core/models/product.model';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { PRODUCT_CLASSIFICATIONS } from '@app/core/lists/product-classifications.list';
import { ConfigApiService } from '@app/shared/services/api/config-apo/config-api.service';
import { ProductConfig } from '../../settings/pages/product-settings/product-settings.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  private readonly configName = 'product';

  classifications: string[] = [];
  filteredClassifications: string[] = [];

  constructor(
    private productApi: ProductApiService,
    private configApi: ConfigApiService,
    private _dialogRef: MatDialogRef<AddProductComponent>,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.configApi.getConfigByName(this.configName).subscribe({
      next: (response: unknown) => {
        const config = response as ProductConfig;
        this.classifications = config.data.productClassifications;
        this.filteredClassifications = this.classifications.slice(0, 20);
      },
      error: ({ error }: HttpErrorResponse) => {
        console.error(error);
        this.snackbarService.openErrorSnackbar(
          error.errorCode,
          'Product Classifications is empty.'
        );
      },
    });
  }

  productForm = new FormGroup({
    sku: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    classification: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormGroup({
      amount: new FormControl(0, Validators.required),
      currency: new FormControl({ value: 'PHP', disabled: true }, [
        Validators.required,
      ]),
    }),
  });

  filterProductClassification(value: string) {
    if (value) {
      this.filteredClassifications = this.classifications.filter((o) =>
        o.toLowerCase().includes(value)
      );
    } else {
      this.filteredClassifications = this.classifications.slice(0, 20);
    }
  }

  onSubmit() {
    this.productForm.disable();
    var product = this.productForm.getRawValue() as Product;
    this.snackbarService.openLoadingSnackbar(
      'CreateData',
      'Adding product to list...'
    );
    this.productApi.createProduct(product).subscribe({
      next: () => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this._dialogRef.close(true);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this.productForm.enable();
          this.snackbarService.openErrorSnackbar(
            err.error.errorCode,
            err.error.message
          );
        });
      },
    });
  }
}

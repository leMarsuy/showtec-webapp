import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '@core/models/product.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { AddProductComponent } from '../add-product/add-product.component';
import { ConfigApiService } from '@app/shared/services/api/config-apo/config-api.service';
import { ProductConfig } from '../../settings/pages/product-settings/product-settings.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent {
  private readonly configName = 'product';
  product!: Product;

  classifications: string[] = [];

  constructor(
    private productApi: ProductApiService,
    private configApi: ConfigApiService,
    private _dialogRef: MatDialogRef<AddProductComponent>,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string }
  ) {}

  productForm = new FormGroup({
    sku: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    description: new FormControl(''),
    classification: new FormControl('UNKNOWN'),
    price: new FormGroup({
      amount: new FormControl(0, Validators.required),
      currency: new FormControl({ value: 'PHP', disabled: true }, [
        Validators.required,
      ]),
    }),
  });

  ngOnInit(): void {
    this.productApi.getProductById(this.data._id).subscribe({
      next: (res) => {
        this.product = res as Product;
        this.productForm.patchValue(res as Product);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });

    this.configApi.getConfigByName(this.configName).subscribe({
      next: (response: unknown) => {
        const config = response as ProductConfig;
        this.classifications = config.data.productClassifications;
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

  onSubmit() {
    this.productForm.disable();
    var product = this.productForm.getRawValue() as Product;
    this.snackbarService.openLoadingSnackbar(
      'EditData',
      'Finalizing changes on product...'
    );
    this.productApi.updateProductById(this.data._id, product).subscribe({
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

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '@core/models/product.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent {
  constructor(
    private productApi: ProductApiService,
    private _dialogRef: MatDialogRef<AddProductComponent>,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string }
  ) {}

  productForm = new FormGroup({
    sku: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    description: new FormControl(''),
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
        this.productForm.patchValue(res as Product);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar('GetError', err.error.message);
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
            'DataError',
            err.error.message
          );
        });
      },
    });
  }
}

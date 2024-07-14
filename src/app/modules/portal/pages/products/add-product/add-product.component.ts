import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { Product } from '@core/models/product.model';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { PRODUCT_CLASSIFICATIONS } from '@app/core/lists/product-classifications.list';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  classifications = PRODUCT_CLASSIFICATIONS;
  filteredClassifications: string[] = [];

  constructor(
    private productApi: ProductApiService,
    private _dialogRef: MatDialogRef<AddProductComponent>,
    private snackbarService: SnackbarService
  ) {
    this.filteredClassifications = this.classifications.slice(0, 5);
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
    if (value)
      this.filteredClassifications = this.classifications.filter((o) =>
        o.toLowerCase().includes(value)
      );
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
            'DataError',
            err.error.message
          );
        });
      },
    });
  }
}

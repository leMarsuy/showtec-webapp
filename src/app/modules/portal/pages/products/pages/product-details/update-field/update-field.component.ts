import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormField } from '@app/core/interfaces/form-field.interface';
import { Product } from '@app/core/models/product.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';

@Component({
  selector: 'app-update-field',
  standalone: true,
  imports: [],
  templateUrl: './update-field.component.html',
  styleUrl: './update-field.component.scss',
})
export class UpdateFieldComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { field: FormField; value: any; product: Product },
    private productApi: ProductApiService,
    private dialogRef: MatDialogRef<UpdateFieldComponent>,
    private snackbarService: SnackbarService
  ) {}

  saveChanges() {
    var { product } = this.data;
    this.productApi.updateProductById(product._id, product).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }
}

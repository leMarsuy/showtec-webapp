import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STOCK_TYPES } from '@app/core/enums/stock-type.enum';
import { Stock } from '@app/core/models/stock.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';

@Component({
  selector: 'app-edit-stock',
  templateUrl: './edit-stock.component.html',
  styleUrl: './edit-stock.component.scss',
})
export class EditStockComponent {
  stockForm = this.fb.group({
    _id: [''],
    serialNumber: [''],
    type: [''],
  });

  STOCK_TYPES = [...STOCK_TYPES];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { _id: string; stock: Stock },
    private productApi: ProductApiService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<EditStockComponent>,
    private fb: FormBuilder
  ) {
    this.stockForm.patchValue(this.data.stock);
  }

  editStock() {
    var { _id } = this.data;
    var stock = this.stockForm.getRawValue() as Stock;
    this.productApi.updateStockById(_id, stock).subscribe({
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

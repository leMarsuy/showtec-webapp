import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Warehouse } from '@core/models/warehouse.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { WarehouseApiService } from '@shared/services/api/warehouse-api/warehouse-api.service';

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrl: './add-warehouse.component.scss',
})
export class AddWarehouseComponent {
  constructor(
    private warehouseApi: WarehouseApiService,
    private _dialogRef: MatDialogRef<AddWarehouseComponent>,
    private snackbarService: SnackbarService,
  ) {}

  warehouseForm = new FormGroup({
    code: new FormControl(''),
    name: new FormControl('', Validators.required),
    email: new FormControl(''),
    mobile: new FormControl(''),
    address: new FormControl(''),
    remarks: new FormControl(''),
  });

  onSubmit() {
    this.warehouseForm.disable();
    var warehouse = this.warehouseForm.getRawValue() as Warehouse;
    this.snackbarService.openLoadingSnackbar(
      'CreateData',
      'Adding warehouse to list...',
    );
    this.warehouseApi.createWarehouse(warehouse).subscribe({
      next: () => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this._dialogRef.close(true);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this.warehouseForm.enable();
          this.snackbarService.openErrorSnackbar(
            err.error.errorCode,
            err.error.message,
          );
        });
      },
    });
  }
}

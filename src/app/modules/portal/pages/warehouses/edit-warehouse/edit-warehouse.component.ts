import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Warehouse } from '@core/models/warehouse.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { WarehouseApiService } from '@shared/services/api/warehouse-api/warehouse-api.service';
import { AddWarehouseComponent } from '../add-warehouse/add-warehouse.component';

@Component({
  selector: 'app-edit-warehouse',
  templateUrl: './edit-warehouse.component.html',
  styleUrl: './edit-warehouse.component.scss',
})
export class EditWarehouseComponent {
  constructor(
    private warehouseApi: WarehouseApiService,
    private _dialogRef: MatDialogRef<AddWarehouseComponent>,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string }
  ) {}

  warehouseForm = new FormGroup({
    code: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    mobile: new FormControl(''),
    address: new FormControl(''),
    remarks: new FormControl(''),
  });

  ngOnInit(): void {
    this.warehouseApi.getWarehouseById(this.data._id).subscribe({
      next: (res) => {
        this.warehouseForm.patchValue(res as Warehouse);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  onSubmit() {
    this.warehouseForm.disable();
    var warehouse = this.warehouseForm.getRawValue() as Warehouse;
    this.snackbarService.openLoadingSnackbar(
      'EditData',
      'Finalizing changes on warehouse...'
    );
    this.warehouseApi.updateWarehouseById(this.data._id, warehouse).subscribe({
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
            err.error.message
          );
        });
      },
    });
  }
}

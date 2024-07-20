import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Supplier } from '@core/models/supplier.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { SupplierApiService } from '@shared/services/api/supplier-api/supplier-api.service';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.scss',
})
export class EditSupplierComponent {
  constructor(
    private supplierApi: SupplierApiService,
    private _dialogRef: MatDialogRef<AddSupplierComponent>,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string }
  ) {}

  supplierForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    mobile: new FormControl(''),
    address: new FormControl(''),
    remarks: new FormControl(''),
  });

  ngOnInit(): void {
    this.supplierApi.getSupplierById(this.data._id).subscribe({
      next: (res) => {
        this.supplierForm.patchValue(res as Supplier);
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
    this.supplierForm.disable();
    var supplier = this.supplierForm.getRawValue() as Supplier;
    this.snackbarService.openLoadingSnackbar(
      'EditData',
      'Finalizing changes on supplier...'
    );
    this.supplierApi.updateSupplierById(this.data._id, supplier).subscribe({
      next: () => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this._dialogRef.close(true);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this.supplierForm.enable();
          this.snackbarService.openErrorSnackbar(
            err.error.errorCode,
            err.error.message
          );
        });
      },
    });
  }
}

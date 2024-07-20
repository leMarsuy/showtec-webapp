import { Component } from '@angular/core';
import { SupplierApiService } from '@shared/services/api/supplier-api/supplier-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { Supplier } from '@core/models/supplier.model';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.scss',
})
export class AddSupplierComponent {
  constructor(
    private supplierApi: SupplierApiService,
    private _dialogRef: MatDialogRef<AddSupplierComponent>,
    private snackbarService: SnackbarService
  ) {}

  supplierForm = new FormGroup({
    code: new FormControl(''),
    name: new FormControl('', Validators.required),
    contactPerson: new FormControl('', Validators.required),
    email: new FormControl(''),
    mobile: new FormControl(''),
    address: new FormControl(''),
    remarks: new FormControl(''),
  });

  onSubmit() {
    this.supplierForm.disable();
    var supplier = this.supplierForm.getRawValue() as Supplier;
    this.snackbarService.openLoadingSnackbar(
      'CreateData',
      'Adding supplier to list...'
    );
    this.supplierApi.createSupplier(supplier).subscribe({
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

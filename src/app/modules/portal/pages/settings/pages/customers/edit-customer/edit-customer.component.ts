import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '@core/models/customer.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { CustomerApiService } from '@shared/services/api/customer-api/customer-api.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import {
  CUSTOMER_TYPES,
  CustomerType,
} from '@app/core/enums/customer-type.enum';
import { CustomerFormComponent } from '@app/shared/forms/customer-form/customer-form.component';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.scss',
})
export class EditCustomerComponent {
  @ViewChild(CustomerFormComponent)
  customerFormComponent!: CustomerFormComponent;

  customerForm!: FormGroup;

  constructor(
    private customerApi: CustomerApiService,
    private _dialogRef: MatDialogRef<AddCustomerComponent>,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string },
  ) {}

  formEventHandler(e: FormGroup) {
    this.customerForm = e;
  }

  deleteCustomer() {
    this.customerApi.deleteCustomerById(this.data._id).subscribe({
      next: (response) => {
        this.snackbarService.openSuccessSnackbar(
          'Delete',
          'Customer Successfully Delete from the Table',
        );
        this._dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message,
        );
      },
    });
  }

  onSubmit() {
    this.customerForm.disable();
    var customer = this.customerForm.getRawValue() as Customer;
    this.snackbarService.openLoadingSnackbar(
      'EditData',
      'Finalizing changes on customer...',
    );
    this.customerApi.updateCustomerById(this.data._id, customer).subscribe({
      next: () => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this._dialogRef.close(true);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this.customerForm.enable();
          this.snackbarService.openErrorSnackbar(
            err.error.errorCode,
            err.error.message,
          );
        });
      },
    });
  }
}

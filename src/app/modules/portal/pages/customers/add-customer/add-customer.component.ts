import { Component, ViewChild } from '@angular/core';
import { CustomerApiService } from '@shared/services/api/customer-api/customer-api.service';
import { Customer } from '@core/models/customer.model';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { CustomerFormComponent } from '@app/shared/forms/customer-form/customer-form.component';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent {
  @ViewChild(CustomerFormComponent)
  customerFormComponent!: CustomerFormComponent;

  customerForm!: FormGroup;

  constructor(
    private customerApi: CustomerApiService,
    private _dialogRef: MatDialogRef<AddCustomerComponent>,
    private snackbarService: SnackbarService,
  ) {}

  formEventHandler(e: FormGroup) {
    this.customerForm = e;
  }

  onSubmit() {
    this.customerForm.disable();
    var customer = this.customerForm.getRawValue() as Customer;
    this.snackbarService.openLoadingSnackbar(
      'CreateData',
      'Adding customer to list...',
    );
    this.customerApi.createCustomer(customer).subscribe({
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

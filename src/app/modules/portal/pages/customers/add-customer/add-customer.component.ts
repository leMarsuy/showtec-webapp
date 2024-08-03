import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerApiService } from '@shared/services/api/customer-api/customer-api.service';
import { Customer } from '@core/models/customer.model';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CUSTOMER_TYPES,
  CustomerType,
} from '@app/core/enums/customer-type.enum';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent implements OnInit {
  customerTypes = CUSTOMER_TYPES;

  constructor(
    private customerApi: CustomerApiService,
    private _dialogRef: MatDialogRef<AddCustomerComponent>,
    private snackbarService: SnackbarService
  ) {}

  customerForm = new FormGroup({
    code: new FormControl(''),
    name: new FormControl('', Validators.required),
    type: new FormControl('', [Validators.required]),
    contactPerson: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    mobile: new FormControl(''),
    tin: new FormControl(''),
    addressDelivery: new FormControl(''),
    addressBilling: new FormControl(''),
    remarks: new FormControl(''),
  });

  ngOnInit(): void {
    this.customerForm.get('type')?.valueChanges.subscribe((value) => {
      if (value === CustomerType.INDIVIDUAL) {
        this.customerForm
          .get('contactPerson')
          ?.setValue(this.customerForm.get('name')?.value || '');
      }
    });
  }

  onSubmit() {
    this.customerForm.disable();
    var customer = this.customerForm.getRawValue() as Customer;
    this.snackbarService.openLoadingSnackbar(
      'CreateData',
      'Adding customer to list...'
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
            err.error.message
          );
        });
      },
    });
  }
}

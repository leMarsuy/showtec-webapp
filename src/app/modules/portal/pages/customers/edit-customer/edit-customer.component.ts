import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.scss',
})
export class EditCustomerComponent implements OnInit {
  customerTypes = CUSTOMER_TYPES;

  constructor(
    private customerApi: CustomerApiService,
    private _dialogRef: MatDialogRef<AddCustomerComponent>,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string }
  ) {}

  customerForm = new FormGroup({
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
    this.customerApi.getCustomerById(this.data._id).subscribe({
      next: (res) => {
        this.customerForm.patchValue(res as Customer);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });

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
      'EditData',
      'Finalizing changes on customer...'
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
            err.error.message
          );
        });
      },
    });
  }
}

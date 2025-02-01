import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CUSTOMER_TYPES,
  CustomerType,
} from '@app/core/enums/customer-type.enum';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';

@Component({
  selector: 'app-add-new-customer',
  templateUrl: './add-new-customer.component.html',
  styleUrl: './add-new-customer.component.scss',
})
export class AddNewCustomerComponent implements OnInit {
  private readonly snackbar = inject(SnackbarService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly customerApi = inject(CustomerApiService);
  private readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef);

  customerTypes = CUSTOMER_TYPES;

  customerForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', [Validators.required]],
    contactPerson: ['', [Validators.required]],
    email: [''],
    mobile: [''],
    tin: [''],
    addressDelivery: [''],
    addressBilling: [''],
    remarks: [''],
  });

  constructor() {
    if (this.data.name) {
      this.customerForm.patchValue(this.data);
    }
  }

  ngOnInit(): void {
    this.customerForm.get('type')?.valueChanges.subscribe((value) => {
      if (value === CustomerType.INDIVIDUAL) {
        this.customerForm
          .get('contactPerson')
          ?.setValue(this.customerForm.get('name')?.value || '');
      }
    });
  }

  onTooltipClose(willSubmit: boolean) {
    if (!willSubmit) return;

    this._onSubmit();
  }

  private _onSubmit() {
    this.snackbar.openLoadingSnackbar('Creating Customer', 'Please Wait...');
    const customer = this.customerForm.getRawValue() as any;

    this.customerApi.createCustomer(customer).subscribe({
      next: (customer) => {
        this.snackbar.closeLoadingSnackbar();
        if (!customer) return;

        this.dialogRef.close(customer);
      },
      error: ({ error }) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        this.dialogRef.close(false);
      },
    });
  }
}

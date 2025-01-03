import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CUSTOMER_TYPES,
  CustomerType,
} from '@app/core/enums/customer-type.enum';
import { Customer } from '@app/core/models/customer.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent implements OnInit {
  @Output() formEmitter: EventEmitter<FormGroup> = new EventEmitter();
  @Input() _id: string = '';

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

  constructor(
    private fb: FormBuilder,
    private customerApi: CustomerApiService,
    private sb: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.customerForm.get('type')?.valueChanges.subscribe((value) => {
      if (value === CustomerType.INDIVIDUAL) {
        this.customerForm
          .get('contactPerson')
          ?.setValue(this.customerForm.get('name')?.value || '');
      }
    });

    if (this._id) this._autofill();

    this.formEmitter.emit(this.customerForm);

    this.customerForm.valueChanges.subscribe(() => {
      this.formEmitter.emit(this.customerForm);
    });
  }

  private _autofill() {
    this.customerApi.getCustomerById(this._id).subscribe({
      next: (res) => {
        this.customerForm.patchValue(res as Customer);
      },
      error: (err: HttpErrorResponse) => {
        this.sb.openErrorSnackbar(err.error.errorCode, err.error.message);
      },
    });
  }
}

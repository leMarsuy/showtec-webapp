import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.scss',
})
export class CustomerRegistrationComponent {
  logoDesc = 'SHOWTEC AUDIO AND LIGHTS SOLUTION CO.';
  logoSrc = 'images/logo.png';
  loading = false;

  customerForm = this.fb.group({
    contactPerson: ['', [Validators.required]],
    name: [''],
    tin: [''],
    email: ['', [Validators.required]],
    mobile: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private customerApi: CustomerApiService,
    private sb: SnackbarService,
  ) {}

  onSubmit() {
    this.confirmation
      .open(
        'Before Submitting',
        'You are about to submit your form. Are your details correct?',
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) this.createCustomer();
      });
  }

  createCustomer() {
    this.loading = true;
    const customer: any = this.customerForm.getRawValue();
    var { contactPerson, name, tin, email, mobile, address } = customer;
    this.customerForm.disable();
    this.customerApi
      .registerCustomer(contactPerson, name, tin, email, mobile, address)
      .subscribe({
        next: (value) => {
          this.loading = false;
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });

          this.customerForm.reset();
          this.customerForm.enable();
          this.sb
            .openSuccessSnackbar(
              'RegisterSuccess',
              'Thank you for registering!',
            )
            .afterDismissed()
            .subscribe({
              next: () => {},
            });
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.customerForm.enable();
          this.sb.openErrorSnackbar(err.error.errorCode, err.error.message);
        },
      });
  }
}

import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-new-customer',
  templateUrl: './add-new-customer.component.html',
  styleUrl: './add-new-customer.component.scss',
})
export class AddNewCustomerComponent {
  private readonly snackbar = inject(SnackbarService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly customerApi = inject(CustomerApiService);
  readonly dialogRef = inject(MatDialogRef);

  customerForm!: FormGroup;

  onFormEmit(e: any) {
    this.customerForm = e;
  }

  onSubmit() {
    const customer = this.customerForm.getRawValue();
    this.confirmation
      .open('Create Confirmation', 'Do you want to add this customer?')
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.snackbar.openLoadingSnackbar(
            'Creating Customer',
            'Please Wait...',
          );
          return this.customerApi.createCustomer(customer);
        }),
      )
      .subscribe({
        next: (customer) => {
          this.snackbar.closeLoadingSnackbar();
          if (!customer) return;

          this.dialogRef.close(customer);
        },
        error: ({ error }) => {
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }
}

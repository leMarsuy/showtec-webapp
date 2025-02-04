import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/core/models/customer.model';
import { AddNewCustomerComponent } from '@app/modules/portal/pages/purchase-order/add-new-customer/add-new-customer.component';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-attach-customer-form',
  templateUrl: './attach-customer-form.component.html',
  styleUrl: './attach-customer-form.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AttachCustomerFormComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input({ required: true }) fGroup!: FormGroup;
  @Input({ alias: 'loading' }) isLoading = false;
  @Input() disableCreateCustomer = false;

  filteredCustomers!: Observable<Customer[]>;

  destroyed$ = new Subject<void>();

  constructor(
    private customerApi: CustomerApiService,
    private dialog: MatDialog,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const formGroup = changes['fGroup']?.currentValue as FormGroup;
    if (!formGroup) return;

    formGroup.valueChanges.pipe(take(2)).subscribe((rawValue) => {
      const _customerId = rawValue?._customerId;
      this.fGroup.get('_customerId')?.setValue(_customerId);
      this.autofillCustomerDetails(_customerId);
    });
  }

  ngOnInit(): void {
    this.filteredCustomers =
      this.fGroup.get('_customerId')?.valueChanges.pipe(
        startWith(this.fGroup.get('_customerId')?.value ?? ''),
        takeUntil(this.destroyed$),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((val: any) => {
          return this._filterCustomers(val || '');
        }),
      ) || of([]);
  }

  autofillCustomerDetails(selectedCustomer: Customer) {
    const { mobile, addressBilling, tin } = selectedCustomer;
    this.fGroup.patchValue({
      mobile,
      address: addressBilling,
      tin,
    });
  }

  displayCustomer(value: any) {
    let displayStr = '';
    if (value.name) {
      displayStr = value.name;
      if (value.name != value.contactPerson) {
        displayStr += ` (${value.contactPerson})`;
      }
    } else {
      displayStr = value || '';
    }
    return displayStr;
  }

  openCreateDialog() {
    const name =
      typeof this.fGroup.controls['_customerId'].value === 'string'
        ? this.fGroup.controls['_customerId'].value
        : '';

    this.dialog
      .open(AddNewCustomerComponent, {
        data: {
          name,
        },
        height: '65vh',
        width: '55vw',
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((customer) => {
        if (!customer) return;

        this.autofillCustomerDetails(customer);
        this.fGroup.controls['_customerId'].setValue(customer);
      });
  }

  private _filterCustomers(value: string) {
    return this.customerApi
      .getCustomersForPurchaseOrder({ searchText: value, pageSize: 8 })
      .pipe(map((response: any) => response.records));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Customer } from '@app/core/models/customer.model';
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
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class CustomerFormComponent implements OnInit {
  @Input({ required: true }) fGroup!: FormGroup;

  filteredCustomers!: Observable<Customer[]>;

  destroyed$ = new Subject<void>();

  constructor(private customerApi: CustomerApiService) {}

  ngOnInit(): void {
    this.filteredCustomers =
      this.fGroup.get('_customerId')?.valueChanges.pipe(
        startWith(this.fGroup.get('_customerId')?.value ?? ''),
        takeUntil(this.destroyed$),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((val: any) => {
          return this._filterCustomers(val || '');
        })
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

  private _filterCustomers(value: string) {
    return this.customerApi
      .getCustomers({ searchText: value, pageSize: 5 })
      .pipe(map((response: any) => response.records));
  }
}

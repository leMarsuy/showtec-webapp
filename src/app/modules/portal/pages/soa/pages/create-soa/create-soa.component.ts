import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  SIGNATORY_ACTIONS,
  SignatoryAction,
} from '@app/core/enums/signatory-action.enum';
import { Customer } from '@app/core/models/customer.model';
import { Product } from '@app/core/models/product.model';
import { User } from '@app/core/models/user.model';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';

interface Pricing {
  STATIC: {
    unit_price: number;
    quantity: number;
    disc?: number;
    total: number;
  };
}

@Component({
  selector: 'app-create-soa',
  templateUrl: './create-soa.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './create-soa.component.scss',
})
export class CreateSoaComponent implements OnInit {
  signatoryActions = SIGNATORY_ACTIONS;
  productNameControl = this.fb.control('');
  signatoryControl = this.fb.control('');
  errorMessage = '';

  filteredCustomers!: Observable<Customer[]>;
  filteredUsers!: Observable<User[]>;
  filteredProducts!: Observable<Product[]>;

  soaForm = this.fb.group({
    _customerId: this.fb.control('', [Validators.required]),
    mobile: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    soaDate: this.fb.control(new Date(), [Validators.required]),
    dueDate: this.fb.control(new Date(), [Validators.required]),
  });

  listedItems: Array<Product & Pricing> = [];
  listedSignatories: Array<User & { action: string }> = [];

  constructor(
    private fb: FormBuilder,
    private productApi: ProductApiService,
    private customerApi: CustomerApiService,
    private userApi: UserApiService
  ) {}

  get _customerId() {
    return this.soaForm.get('_customerId') as FormControl;
  }

  searchSerialNumber() {
    var serialNumber = this.productNameControl.value;
    console.log(serialNumber);
  }

  pushToListedProducts(product: Product & Pricing) {
    var li = this.listedItems;
    if (!li.find((o) => o.stocks[0]._id === product.stocks[0]._id))
      this.listedItems.push({
        ...product,
        STATIC: {
          unit_price: product.price.amount,
          quantity: 1,
          disc: 0,
          total: product.price.amount,
        },
      });

    console.log(this.listedItems);
  }

  removeFromListedProducts(i: number) {
    this.listedItems.splice(i, 1);
  }

  ngOnInit(): void {
    this.filteredCustomers = this._customerId.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterCustomers(val || '');
      })
    );

    this.filteredUsers = this.signatoryControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterUsers(val || '');
      })
    );

    this.filteredProducts = this.productNameControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        this.productNameControl.reset();
        return this._filterProducts(val || '');
      })
    );
  }

  createSOA() {}

  pushToListedSignatories(user: User) {
    if (!this.listedSignatories.find((o) => o._id === user._id))
      this.listedSignatories.push({
        ...user,
        action: SignatoryAction.APPROVED,
      });

    this.signatoryControl.reset();
  }

  removeFromListedSignatories(i: number) {
    this.listedSignatories.splice(i, 1);
  }

  private _filterCustomers(value: string) {
    return this.customerApi
      .getCustomers({ searchText: value, pageSize: 5 })
      .pipe(map((response: any) => response.records));
  }

  private _filterUsers(value: string) {
    return this.userApi
      .getUsers({ searchText: value, pageSize: 5 })
      .pipe(map((response: any) => response.records));
  }

  private _filterProducts(value: string) {
    return this.productApi
      .getProducts({ searchText: value, pageSize: 5 })
      .pipe(map((response: any) => response.records));
  }

  displayCustomer(value: any) {
    return value.name || value || '';
  }

  displayUser(value: any) {
    return value.name || value || '';
  }

  autofillCustomerDetails(selectedCustomer: Customer) {
    var { mobile, address } = selectedCustomer;
    this.soaForm.patchValue({
      mobile,
      address,
    });
  }
}

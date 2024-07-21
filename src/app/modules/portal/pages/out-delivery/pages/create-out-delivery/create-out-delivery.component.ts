import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import {
  SIGNATORY_ACTIONS,
  SignatoryAction,
} from '@app/core/enums/signatory-action.enum';
import { Customer } from '@app/core/models/customer.model';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { Product } from '@app/core/models/product.model';
import { User } from '@app/core/models/user.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
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

@Component({
  selector: 'app-create-out-delivery',
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-out-delivery.component.html',
  styleUrl: './create-out-delivery.component.scss',
})
export class CreateOutDeliveryComponent implements OnInit {
  signatoryActions = SIGNATORY_ACTIONS;
  serialNumberControl = new FormControl('');
  signatoryControl = new FormControl('');
  errorMessage = '';

  deliveryForm = this.fb.group({
    _customerId: this.fb.control('', [Validators.required]),
    mobile: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    deliveryDate: this.fb.control(new Date(), [Validators.required]),
  });

  constructor(
    private productApi: ProductApiService,
    private customerApi: CustomerApiService,
    private userApi: UserApiService,
    private outdeliveryApi: OutDeliveryApiService,
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  listedItems: Array<Product> = [];
  listedSignatories: Array<User & { action: string }> = [];

  searchSerialNumber() {
    var serialNumber = this.serialNumberControl.value;
    console.log(serialNumber);
    this.serialNumberControl.disable();
    if (serialNumber)
      this.productApi.getInStockProductBySerialNumber(serialNumber).subscribe({
        next: (res: any) => {
          this.pushToListedProducts(res);
          this.serialNumberControl.enable();
          this.serialNumberControl.reset();
          document.getElementById('serialNumber')?.focus();
          this.errorMessage = '';
        },
        error: (err) => {
          this.serialNumberControl.enable();
          this.serialNumberControl.reset();
          document.getElementById('serialNumber')?.focus();
          this.errorMessage = `${serialNumber} does not exist or not available.`;
        },
      });
  }

  pushToListedProducts(product: Product) {
    var li = this.listedItems;
    if (!li.find((o) => o.stocks[0]._id === product.stocks[0]._id))
      this.listedItems.push(product);
  }

  removeFromListedProducts(i: number) {
    this.listedItems.splice(i, 1);
  }

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

  get _customerId() {
    return this.deliveryForm.get('_customerId') as FormControl;
  }

  filteredCustomers!: Observable<Customer[]>;
  filteredUsers!: Observable<User[]>;

  ngOnInit() {
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

  autofillCustomerDetails(selectedCustomer: Customer) {
    var { mobile, address } = selectedCustomer;
    this.deliveryForm.patchValue({
      mobile,
      address,
    });
  }

  displayCustomer(value: any) {
    return value.name || value || '';
  }

  displayUser(value: any) {
    return value.name || value || '';
  }

  createOutDelivery() {
    var rawOutdelivery = this.deliveryForm.getRawValue() as any;
    var outdelivery: OutDelivery = {
      _customerId: rawOutdelivery._customerId._id,
      deliveryDate: rawOutdelivery.deliveryDate,
      STATIC: {
        name: rawOutdelivery._customerId.name,
        mobile: rawOutdelivery._customerId.mobile,
        address: rawOutdelivery._customerId.address,
      },
      signatories: [],
      items: [],
    };

    this.listedItems.forEach((item) => {
      outdelivery.items.push({
        _productId: item._id,
        STATIC: {
          _stockId: item.stocks[0]._id,
          sku: item.sku,
          brand: item.brand,
          model: item.model,
          serialNumber: item.stocks[0].serialNumber,
        },
      });
    });

    this.listedSignatories.forEach((signatory) => {
      outdelivery.signatories.push({
        _userId: signatory._id,
        STATIC: {
          name: signatory.name,
          designation: signatory.designation,
        },
        action: signatory.action,
      });
    });

    this.outdeliveryApi.createOutDelivery(outdelivery).subscribe({
      next: (res) => {
        this.snackbarService.openSuccessSnackbar(
          'Success',
          'Out Delivery Successfully Created.'
        );
        setTimeout(() => {
          this.router.navigate(['/portal/out-delivery']);
        }, 1400);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }
}

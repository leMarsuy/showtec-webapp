import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import {
  SIGNATORY_ACTIONS,
  SignatoryAction,
} from '@app/core/enums/signatory-action.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Customer } from '@app/core/models/customer.model';
import { Product } from '@app/core/models/product.model';
import { Discount, SOA } from '@app/core/models/soa.model';
import { User } from '@app/core/models/user.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { deepInsert } from '@app/shared/utils/deepInsert';
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
  discountForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    value: this.fb.control(0, [Validators.required]),
  });

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
    remarks: this.fb.control(''),
  });

  listedItems: Array<Product & Pricing> = [];
  listedSignatories: Array<User & { action: string }> = [];
  listedDiscounts: Array<Discount> = [];

  constructor(
    private fb: FormBuilder,
    private productApi: ProductApiService,
    private customerApi: CustomerApiService,
    private userApi: UserApiService,
    private soaApi: SoaApiService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  listedItemsColumns: TableColumn[] = [
    {
      label: 'Item',
      dotNotationPath: 'brand',
      type: ColumnType.STRING,
    },
    {
      label: 'Desc',
      dotNotationPath: 'classification',
      type: ColumnType.STRING,
    },
    {
      label: 'In Stock',
      dotNotationPath: '_$stockSummary.In Stock',
      type: ColumnType.STRING,
    },

    {
      label: 'Price',
      dotNotationPath: 'STATIC.unit_price',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Qty',
      dotNotationPath: 'STATIC.quantity',
      editable: true,
      type: ColumnType.NUMBER,
    },
    {
      label: 'Disc.',
      dotNotationPath: 'STATIC.disc',
      editable: true,
      type: ColumnType.NUMBER,
    },
    {
      label: 'Total',
      dotNotationPath: 'STATIC.total',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Action',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: '[4rem]',
      actions: [
        { icon: 'remove', name: 'remove', color: Color.ERROR },
        // { icon: 'add', name: 'edit', color: Color.SUCCESS },
      ],
    },
  ];

  listedItemsPage: PageEvent = {
    pageIndex: 0,
    pageSize: 100,
    length: 0,
  };

  actionEventHandler(e: any) {
    console.log(e);
    if (e.action.name == 'remove') {
      console.log('removing');
      this.removeFromListedProducts(e.i);
    }
  }

  updateCellEventHandler(e: {
    newValue: any;
    column: TableColumn;
    element: Product & Pricing;
  }) {
    deepInsert(e.newValue, e.column.dotNotationPath, e.element);
    var total = e.element.STATIC.quantity * e.element.STATIC.unit_price;
    e.element.STATIC.total = total - (e.element.STATIC.disc || 0) * total;

    console.log(total);

    this.listedItems = [...this.listedItems];
    console.log(this.listedItems);

    this.listedItemsPage.length = -1;

    setTimeout(() => {
      this.listedItemsPage.length = this.listedItems.length;
    }, 20);
  }

  get _customerId() {
    return this.soaForm.get('_customerId') as FormControl;
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
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length++;
    this.productNameControl.reset();
  }

  removeFromListedProducts(i: number) {
    this.listedItems.splice(i, 1);
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length--;
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
        return this._filterProducts(val || '');
      })
    );
  }

  createSOA() {
    var rawSoaForm = this.soaForm.getRawValue() as any;
    var soa: SOA = {
      _customerId: rawSoaForm._customerId._id,
      STATIC: {
        name: rawSoaForm._customerId.name,
        mobile: rawSoaForm._customerId.mobile,
        address: rawSoaForm._customerId.address,
      },
      soaDate: rawSoaForm.soaDate,
      dueDate: rawSoaForm.dueDate,
      signatories: [],
      items: [],
      discounts: this.listedDiscounts,
      remarks: rawSoaForm.remarks,
    };

    this.listedItems.forEach((item) => {
      soa.items.push({
        _productId: item._id,
        STATIC: {
          sku: item.sku,
          brand: item.brand,
          model: item.model,
          classification: item.classification || '-',
          unit_price: item.STATIC.unit_price,
          quantity: item.STATIC.quantity,
          disc: item.STATIC.disc || 0,
          total: item.STATIC.total,
        },
      });
    });

    this.listedSignatories.forEach((signatory) => {
      soa.signatories.push({
        _userId: signatory._id,
        STATIC: {
          name: signatory.name,
          designation: signatory.designation,
        },
        action: signatory.action,
      });
    });

    this.soaApi.createSoa(soa).subscribe({
      next: () => {
        this.snackbarService.openSuccessSnackbar(
          'Success',
          'SOA Successfully Created.'
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

  pushToListedDiscounts() {
    this.listedDiscounts.push({
      ...(this.discountForm.getRawValue() as Discount),
    });

    this.discountForm.reset();
  }

  removeFromListedDiscounts(i: number) {
    this.listedDiscounts.splice(i, 1);
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
    var { mobile, addressBilling } = selectedCustomer;
    this.soaForm.patchValue({
      mobile,
      address: addressBilling,
    });
  }
}

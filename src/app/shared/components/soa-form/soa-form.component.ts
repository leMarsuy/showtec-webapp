import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import {
  SIGNATORY_ACTIONS,
  SignatoryAction,
} from '@app/core/enums/signatory-action.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Customer } from '@app/core/models/customer.model';
import { Product } from '@app/core/models/product.model';
import { Discount, SOA, Tax } from '@app/core/models/soa.model';
import { User } from '@app/core/models/user.model';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { deepInsert } from '@app/shared/utils/deepInsert';
import {
  Observable,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';
import { Router } from '@angular/router';
import { ConfirmationService } from '../confirmation/confirmation.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Alignment } from '@app/core/enums/align.enum';

interface Pricing {
  STATIC: {
    unit_price: number;
    quantity: number;
    disc?: number;
    total: number;
  };
}

@Component({
  selector: 'app-soa-form',
  templateUrl: './soa-form.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './soa-form.component.scss',
})
export class SoaFormComponent implements OnInit {
  signatoryActions = SIGNATORY_ACTIONS;
  productNameControl = this.fb.control('');
  signatoryControl = this.fb.control('');
  discountForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    value: this.fb.control(0, [Validators.required]),
  });

  taxForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    value: this.fb.control(0, [Validators.required]),
  });

  soa!: SOA;
  @Input() _id!: string;

  searchId() {
    this.soaApi.getSoaById(this._id).subscribe({
      next: (res) => {
        this.soa = res as SOA;
        this.autoFillForm();
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  autoFillForm() {
    var soa = this.soa;
    this.soaForm.patchValue({
      _customerId: soa._customerId,
      mobile: soa.STATIC.mobile,
      address: soa.STATIC.address,
      tin: soa.STATIC.tin,
      soaDate: soa.soaDate,
      remarks: soa.remarks,
    });

    for (let item of soa.items) {
      this.listedItems.push({
        sku: item.STATIC.sku,
        _id: item._productId,
        brand: item.STATIC.brand,
        model: item.STATIC.model,
        classification: item.STATIC.classification,
        price: {
          amount: item.STATIC.unit_price,
          currency: 'PHP',
        },
        STATIC: {
          unit_price: item.STATIC.unit_price,
          quantity: item.STATIC.quantity,
          disc: item.STATIC.disc,
          total: item.STATIC.total,
        },
      } as unknown as Product & Pricing);
    }

    soa.signatories.forEach((sig: any) => {
      this.listedSignatories.push({
        name: sig.STATIC.name,
        designation: sig.STATIC.designation,
        action: sig.action,
        _id: sig._userId,
      });
    });

    this.listedDiscounts =
      soa.discounts?.map((a) => ({ name: a.name, value: a.value })) || [];
    this.listedTaxes =
      soa.taxes?.map((a) => ({ name: a.name, value: a.value })) || [];

    this.listedSignatories = [...this.listedSignatories];
    this.listedSignatoriesPage.length = this.listedSignatories.length;

    this.listedDiscountsPage.length = this.listedDiscounts.length;
    this.listedTaxesPage.length = this.listedSignatories.length;

    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
    // this.soaForm.get('_customerId')?.disable();
    this._calculateSummary();
  }

  errorMessage = '';

  filteredCustomers!: Observable<Customer[]>;
  filteredUsers!: Observable<User[]>;
  filteredProducts!: Observable<Product[]>;

  soaForm = this.fb.group({
    _customerId: this.fb.control('', [Validators.required]),
    mobile: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    tin: this.fb.control(''),
    soaDate: this.fb.control(new Date(), [Validators.required]),
    dueDate: this.fb.control(new Date(), [Validators.required]),
    remarks: this.fb.control(''),
  });
  constructor(
    private fb: FormBuilder,
    private productApi: ProductApiService,
    private customerApi: CustomerApiService,
    private userApi: UserApiService,
    private soaApi: SoaApiService,
    private snackbarService: SnackbarService,
    private router: Router,
    private confirmation: ConfirmationService
  ) {}

  listedDiscounts: Array<Discount> = [];
  listedDiscountsColumns: TableColumn[] = [
    {
      label: 'Name',
      dotNotationPath: 'name',
      type: ColumnType.STRING,
    },
    {
      label: 'Value',
      dotNotationPath: 'value',
      type: ColumnType.NUMBER,
    },
    {
      label: 'Remove',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: '[2rem]',
      actions: [{ icon: 'remove', name: 'remove', color: Color.ERROR }],
    },
  ];
  listedDiscountsPage: PageEvent = {
    pageIndex: 0,
    pageSize: 100,
    length: 0,
  };

  listedTaxes: Array<Discount> = [
    {
      name: 'VAT 12%',
      value: 0.12,
    },
  ];
  listedTaxesColumns: TableColumn[] = [
    {
      label: 'Name',
      dotNotationPath: 'name',
      type: ColumnType.STRING,
    },
    {
      label: 'Value',
      dotNotationPath: 'value',
      type: ColumnType.PERCENTAGE,
    },
    {
      label: 'Remove',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: '[2rem]',
      actions: [{ icon: 'remove', name: 'remove', color: Color.ERROR }],
    },
  ];
  listedTaxesPage: PageEvent = {
    pageIndex: 0,
    pageSize: 100,
    length: 1,
  };

  listedSignatories: Array<any> = [];
  listedSignatoriesColumns: TableColumn[] = [
    {
      label: 'Name',
      dotNotationPath: 'name',
      type: ColumnType.STRING,
    },
    {
      label: 'Designation',
      dotNotationPath: 'designation',
      type: ColumnType.STRING,
    },
    {
      label: 'Action',
      dotNotationPath: 'action',
      type: ColumnType.STRING,
      editable: true,
    },
    {
      label: 'Remove',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: '[2rem]',
      actions: [{ icon: 'remove', name: 'remove', color: Color.ERROR }],
    },
  ];
  listedSignatoriesPage: PageEvent = {
    pageIndex: 0,
    pageSize: 100,
    length: 0,
  };

  listedItems: Array<Product & Pricing> = [];
  listedItemsColumns: TableColumn[] = [
    {
      label: 'Brand',
      dotNotationPath: 'brand',
      type: ColumnType.STRING,
    },
    {
      label: 'Model',
      dotNotationPath: 'model',
      type: ColumnType.STRING,
    },
    {
      label: 'Desc.',
      dotNotationPath: 'classification',
      type: ColumnType.STRING,
      editable: true,
    },
    {
      label: 'Price',
      dotNotationPath: 'STATIC.unit_price',
      type: ColumnType.CURRENCY,
      editable: true,
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
      type: ColumnType.PERCENTAGE,
    },
    {
      label: 'Total',
      dotNotationPath: 'STATIC.total',
      type: ColumnType.CURRENCY,
    },
    {
      label: '#',
      align: Alignment.CENTER,
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: 'fit',
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
    if (e.action.name == 'remove') {
      console.log('removing');
      this.removeFromListedProducts(e.i);
    }
  }

  actionEventSignatories(e: any) {
    if (e.action.name == 'remove') {
      this.removeFromListedSignatories(e.i);
    }
  }

  actionEventDiscounts(e: any) {
    if (e.action.name == 'remove') {
      this.removeFromListedDiscounts(e.i);
    }
  }

  actionEventTaxes(e: any) {
    if (e.action.name == 'remove') {
      this.removeFromListedTaxes(e.i);
    }
  }

  getLastSOA() {
    // this.soaApi.getMostRecentSOA().subscribe({
    //   next: (res: any) => {
    //     res.signatories.forEach((sig: any) => {
    //       this.listedSignatories.push({
    //         name: sig.STATIC.name,
    //         designation: sig.STATIC.designation,
    //         action: sig.action,
    //       });
    //     });
    //     this.listedSignatories = [...this.listedSignatories];
    //     this.listedSignatoriesPage.length = this.listedSignatories.length;
    //   },
    // });
  }

  updateCellEventHandler(e: {
    newValue: any;
    column: TableColumn;
    element: Product & Pricing;
  }) {
    console.log('update');
    deepInsert(e.newValue, e.column.dotNotationPath, e.element);
    var total = e.element.STATIC.quantity * e.element.STATIC.unit_price;
    e.element.STATIC.total = total - (e.element.STATIC.disc || 0) * total;
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = -1;
    setTimeout(() => {
      this.listedItemsPage.length = this.listedItems.length;
      this._calculateSummary();
    }, 20);
  }

  updateSignatories(e: any) {
    deepInsert(e.newValue, e.column.dotNotationPath, e.element);
    this.listedSignatories = [...this.listedSignatories];
    this.listedSignatoriesPage.length = -1;
    setTimeout(() => {
      this.listedSignatoriesPage.length = this.listedSignatories.length;
    }, 20);
  }

  get _customerId() {
    return this.soaForm.get('_customerId') as FormControl;
  }

  pushToListedProducts(product: Product & Pricing) {
    var li = this.listedItems;
    if (!li.find((o) => o._id === product._id))
      this.listedItems.push({
        ...product,
        STATIC: {
          unit_price: product.price.amount,
          quantity: 1,
          disc: 0.5,
          total: product.price.amount,
        },
      });
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length++;
    this._calculateSummary();
    this.productNameControl.reset();
  }

  removeFromListedProducts(i: number) {
    this.listedItems.splice(i, 1);
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length--;
    this._calculateSummary();
  }

  ngOnInit(): void {
    if (this._id) this.searchId();
    else this.getLastSOA();

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
        console.log(val);
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
        mobile: rawSoaForm.mobile,
        address: rawSoaForm.address,
        tin: rawSoaForm.tin,
      },
      soaDate: rawSoaForm.soaDate,
      dueDate: rawSoaForm.dueDate,
      signatories: [],
      items: [],
      discounts: this.listedDiscounts,
      taxes: this.listedTaxes,
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
          this.router.navigate(['/portal/soa']);
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

  updateSOA() {
    var rawSoaForm = this.soaForm.getRawValue() as any;

    var soa: any = {
      _customerId: rawSoaForm._customerId._id,
      STATIC: {
        name: rawSoaForm._customerId.name,
        address: rawSoaForm.address,
        mobile: rawSoaForm.mobile,
        tin: rawSoaForm.tin,
      },
      soaDate: rawSoaForm.soaDate,
      dueDate: rawSoaForm.dueDate,
      signatories: [],
      items: [],
      discounts: this.listedDiscounts,
      taxes: this.listedTaxes,
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

    console.log(soa);

    this.soaApi.updateSoaById(this._id, soa).subscribe({
      next: (newSoa: any) => {
        this.snackbarService.openSuccessSnackbar(
          'Update Success',
          `SOA ${newSoa.code?.value} successfully updated.`
        );
        setTimeout(() => {
          this.router.navigate(['/portal/soa']);
        }, 1400);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  pushToListedSignatories(user: User) {
    this.listedSignatories.push({
      ...user,
      action: SignatoryAction.APPROVED,
    });
    this.listedSignatories = [...this.listedSignatories];
    this.listedSignatoriesPage.length = this.listedSignatories.length;
    this.signatoryControl.reset();
  }

  removeFromListedSignatories(i: number) {
    this.listedSignatories.splice(i, 1);
    this.listedSignatories = [...this.listedSignatories];
    this.listedSignatoriesPage.length = this.listedSignatories.length;
  }

  pushToListedDiscounts() {
    this.listedDiscounts.push({
      ...(this.discountForm.getRawValue() as Discount),
    });
    this.listedDiscounts = [...this.listedDiscounts];
    this.listedDiscountsPage.length = this.listedDiscounts.length;
    this._calculateSummary();
    this.discountForm.reset();
  }

  pushToListedTaxes() {
    this.listedTaxes.push({
      ...(this.taxForm.getRawValue() as Tax),
    });
    this.listedTaxes = [...this.listedTaxes];
    this.listedTaxesPage.length = this.listedTaxes.length;
    this._calculateSummary();
    this.taxForm.reset();
  }

  removeFromListedDiscounts(i: number) {
    this.listedDiscounts.splice(i, 1);
    this.listedDiscounts = [...this.listedDiscounts];
    this.listedDiscountsPage.length = this.listedDiscounts.length;
    this._calculateSummary();
  }

  removeFromListedTaxes(i: number) {
    this.listedTaxes.splice(i, 1);
    this.listedTaxes = [...this.listedTaxes];
    this.listedTaxesPage.length = this.listedTaxes.length;
    this._calculateSummary();
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
      .getProducts({ searchText: value, pageSize: 30 })
      .pipe(map((response: any) => response.records));
  }

  displayCustomer(value: any) {
    return value.name || value || '';
  }

  displayUser(value: any) {
    return value.name || value || '';
  }

  confirm() {
    this.confirmation
      .open(
        'Confirmation',
        'You will be adding a <b>Delivery Receipt</b>. Would you like to proceed on this action?'
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) this.createSOA();
      });
  }

  customerName = ''; //remove

  confirmChanges() {
    this.confirmation
      .open(
        'Before you apply the changes...',
        `This will modify the SOA for <b class='text-rose-500'>${this.customerName}</b>. Would you like to proceed with this action?`
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.updateSOA();
        }
      });
  }

  confirmDiscard() {
    this.confirmation
      .open(
        'Cancel Edit',
        `Any changes will not be saved for <b class='text-rose-500'>${this.customerName}</b>. Are you sure?`
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['portal/soa']);
        }
      });
  }

  autofillCustomerDetails(selectedCustomer: Customer) {
    var { mobile, addressBilling, tin } = selectedCustomer;
    this.soaForm.patchValue({
      mobile,
      address: addressBilling,
      tin,
    });
  }

  soaSummary = {
    total: 0,
    productDiscount: 0,
    subtotal: 0,
    grandtotal: 0,
  };

  _calculateSummary() {
    this.soaSummary = {
      total: 0,
      productDiscount: 0,
      subtotal: 0,
      grandtotal: 0,
    };

    for (var item of this.listedItems) {
      this.soaSummary.total += item.STATIC.unit_price * item.STATIC.quantity;
      this.soaSummary.productDiscount +=
        item.STATIC.unit_price * item.STATIC.quantity * (item.STATIC.disc || 0);
    }

    this.soaSummary.subtotal =
      this.soaSummary.total - this.soaSummary.productDiscount;

    for (var disc of this.listedDiscounts) {
      this.soaSummary.subtotal -= disc.value;
    }

    this.soaSummary.grandtotal = this.soaSummary.subtotal;

    for (var tax of this.listedTaxes) {
      this.soaSummary.grandtotal += this.soaSummary.subtotal * tax.value;
    }
  }
}

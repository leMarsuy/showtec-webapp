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
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { Product } from '@app/core/models/product.model';
import { User } from '@app/core/models/user.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
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
    remarks: this.fb.control(''),
  });

  constructor(
    private productApi: ProductApiService,
    private customerApi: CustomerApiService,
    private userApi: UserApiService,
    private outdeliveryApi: OutDeliveryApiService,
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private confirmation: ConfirmationService
  ) {}

  listedSignatories: Array<any> = [];

  listedItems: Array<Product> = [];
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
      label: 'S/N',
      dotNotationPath: 'stocks.0.serialNumber',
      type: ColumnType.STRING,
    },
    {
      label: 'Status',
      dotNotationPath: 'stocks.0.status',
      type: ColumnType.STRING,
    },
    {
      label: 'Remove',
      dotNotationPath: 'stocks',
      type: ColumnType.ACTION,
      width: '[2rem]',
      actions: [{ icon: 'remove', name: 'remove', color: Color.ERROR }],
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

  getLastOutDelivery() {
    this.outdeliveryApi.getMostRecentOutDelivery().subscribe({
      next: (res: any) => {
        res.signatories.forEach((sig: any) => {
          this.listedSignatories.push({
            name: sig.STATIC.name,
            designation: sig.STATIC.designation,
            action: sig.action,
          });
        });
      },
    });
  }

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
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
  }

  removeFromListedProducts(i: number) {
    this.listedItems.splice(i, 1);
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
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
    this.getLastOutDelivery();

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
    var { mobile, addressDelivery } = selectedCustomer;
    this.deliveryForm.patchValue({
      mobile,
      address: addressDelivery,
    });
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
        if (res) this.createOutDelivery();
      });
  }

  createOutDelivery() {
    // add confirmation

    var rawOutdelivery = this.deliveryForm.getRawValue() as any;
    var outdelivery: OutDelivery = {
      _customerId: rawOutdelivery._customerId._id,
      deliveryDate: rawOutdelivery.deliveryDate,
      remarks: rawOutdelivery.remarks,
      STATIC: {
        name: rawOutdelivery._customerId.name,
        mobile: rawOutdelivery.mobile,
        address: rawOutdelivery.address,
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
          classification: item.classification || '-',
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
      next: (res: any) => {
        this.outdeliveryApi.getPdfOutDelivery(res._id).subscribe({
          next: (pdf: any) => {
            var w = window.open('', '_blank');
            w?.document.write(
              `<iframe width='100%' height='100%' src='${encodeURI(
                pdf.base64
              )}'></iframe>`
            );
            this.snackbarService.openSuccessSnackbar(
              'Success',
              'Out Delivery Successfully Created.'
            );
            setTimeout(() => {
              this.router.navigate(['/portal/out-delivery']);
            }, 1400);
          },
        });
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

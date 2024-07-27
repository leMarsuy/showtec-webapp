import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
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
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import {
  Observable,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from 'rxjs';
import { ConfirmationService } from '../confirmation/confirmation.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { StockStatus } from '@app/core/enums/stock-status.enum';

@Component({
  selector: 'app-out-delivery-form',
  templateUrl: './out-delivery-form.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './out-delivery-form.component.scss',
})
export class OutDeliveryFormComponent implements OnInit {
  signatoryActions = SIGNATORY_ACTIONS;
  serialNumberControl = new FormControl('');
  signatoryControl = new FormControl('');
  errorMessage = '';
  outDelivery!: OutDelivery;
  @Input() _id!: string;

  searchId() {
    this.outdeliveryApi.getOutDeliveryById(this._id).subscribe({
      next: (res) => {
        this.outDelivery = res as OutDelivery;
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
    var outDelivery = this.outDelivery;
    this.deliveryForm.patchValue({
      _customerId: outDelivery.STATIC.name,
      mobile: outDelivery.STATIC.mobile,
      address: outDelivery.STATIC.address,
      deliveryDate: outDelivery.deliveryDate,
      remarks: outDelivery.remarks,
    });

    outDelivery.items.forEach((item) => {
      var listedItem = {
        sku: item.STATIC.sku,
        _id: item._productId,
        brand: item.STATIC.brand,
        model: item.STATIC.model,
        classification: item.STATIC.classification,
        stocks: [
          {
            serialNumber: item.STATIC.serialNumber,
            _id: item.STATIC._stockId,
            status: StockStatus.FOR_DELIVERY,
          },
        ],
      };
      this.listedItems.push(listedItem as Product);
    });

    outDelivery.signatories.forEach((sig: any) => {
      this.listedSignatories.push({
        name: sig.STATIC.name,
        designation: sig.STATIC.designation,
        action: sig.action,
        _id: sig._userId,
      });
    });

    this.listedSignatories = [...this.listedSignatories];
    this.listedSignatoriesPage.length = this.listedSignatories.length;

    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
    this.deliveryForm.get('_customerId')?.disable();
  }

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

  listedItems: Array<Product> = [];
  listedItemsColumns: TableColumn[] = [
    {
      label: 'Item',
      dotNotationPath: 'brand',
      type: ColumnType.STRING,
    },
    {
      label: 'Description',
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

  actionEventItems(e: any) {
    if (e.action.name == 'remove') {
      this.removeFromListedProducts(e.i);
    }
  }

  actionEventSignatories(e: any) {
    if (e.action.name == 'remove') {
      this.removeFromListedSignatories(e.i);
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

        this.listedSignatories = [...this.listedSignatories];
        this.listedSignatoriesPage.length = this.listedSignatories.length;
      },
    });
  }

  searchSerialNumber() {
    var serialNumber = this.serialNumberControl.value;
    if (serialNumber)
      this.productApi.getInStockProductBySerialNumber(serialNumber).subscribe({
        next: (res: any) => {
          this.pushToListedProducts(res);
          this.serialNumberControl.reset();
          this.errorMessage = '';
        },
        error: (err) => {
          this.serialNumberControl.reset();
          this.errorMessage = `SN No. ${serialNumber} does not exist or not available.`;
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
    var li = this.listedItems[i];
    if (li.stocks[0].status == StockStatus.FOR_DELIVERY) {
      this.snackbarService.openErrorSnackbar(
        'ACTION NOT ALLOWED',
        `Unable to delete <b>${li.brand} ${li.model}, S/N: ${li.stocks[0].serialNumber}</b>.`
      );
      return;
    }
    this.listedItems.splice(i, 1);
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
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

  get _customerId() {
    return this.deliveryForm.get('_customerId') as FormControl;
  }

  get customerName() {
    return this.deliveryForm.getRawValue()._customerId;
  }

  filteredCustomers!: Observable<Customer[]>;
  filteredUsers!: Observable<User[]>;

  ngOnInit() {
    if (this._id) this.searchId();
    else this.getLastOutDelivery();

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

  confirmChanges() {
    this.confirmation
      .open(
        'Before you apply the changes...',
        `You will be <b>REMOVING 2 ITEMS</b> and <b>ADDING 2 NEW ITEMS</b> for:
        <br/> <b class='text-rose-500'>${this.customerName}</b>
        <br/><br/> Would you like to continue?`
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.updateOutDelivery();
        }
      });
  }

  updateOutDelivery() {
    var rawOutdelivery = this.deliveryForm.getRawValue() as any;
    var outdelivery: any = {
      deliveryDate: rawOutdelivery.deliveryDate,
      remarks: rawOutdelivery.remarks,
      STATIC: {
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

    this.outdeliveryApi.updateOutDeliveryById(this._id, outdelivery).subscribe({
      next: (res: any) => {
        this.snackbarService.openSuccessSnackbar(
          'UPDATE_SUCCESS',
          'Successfully Updated D/R: ' +
            this.outDelivery.code?.value +
            ' for ' +
            this.outDelivery.STATIC.name +
            '.'
        );
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  createOutDelivery() {
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

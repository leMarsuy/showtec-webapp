import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  firstValueFrom,
  takeUntil,
  Subject,
  catchError,
  of,
  lastValueFrom,
} from 'rxjs';
import { SnackbarService } from '../../components/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { ConfirmationService } from '../../components/confirmation/confirmation.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Alignment } from '@app/core/enums/align.enum';
import { PdfViewerComponent } from '@app/shared/components/pdf-viewer/pdf-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import {
  TransformDataService,
  TransformReference,
} from '@app/shared/services/data/transform-data/transform-data.service';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';

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
export class SoaFormComponent implements OnInit, OnDestroy {
  @Input() _id!: string;
  private transformServiceId: TransformReference = 'soa';

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

  usePurchaseOrder = false;
  searchPoControl = new FormControl();
  errorMessage = '';

  filteredCustomers!: Observable<Customer[]>;
  filteredUsers!: Observable<User[]>;
  filteredProducts!: Observable<Product[]>;
  filteredPos!: Observable<PurchaseOrder[]>;

  destroyed$ = new Subject<void>();

  soaForm = this.fb.group({
    _customerId: this.fb.control('', [Validators.required]),
    _purchaseOrderId: this.fb.control(''),
    mobile: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    tin: this.fb.control(''),
    soaDate: this.fb.control(new Date(), [Validators.required]),
    dueDate: this.fb.control(new Date(), [Validators.required]),
    remarks: this.fb.control(''),
  });

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
    // {
    //   name: 'VAT 12%',
    //   value: 0.12,
    // },
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
    length: 0,
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
      options: SIGNATORY_ACTIONS,
      width: '[20rem]',
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
      label: 'Item',
      dotNotationPath: ['brand', 'model'],
      type: ColumnType.STRING,
    },
    {
      label: 'Desc.',
      dotNotationPath: 'classification',
      type: ColumnType.STRING,
      editable: true,
      width: '[10rem]',
    },
    {
      label: 'Price',
      dotNotationPath: 'STATIC.unit_price',
      type: ColumnType.CURRENCY,
      editable: true,
      width: '[9rem]',
    },
    {
      label: 'Qty',
      dotNotationPath: 'STATIC.quantity',
      editable: true,
      type: ColumnType.NUMBER,
      width: '[7rem]',
    },
    {
      label: 'Disc.',
      dotNotationPath: 'STATIC.disc',
      editable: true,
      type: ColumnType.PERCENTAGE,
      width: '[7rem]',
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

  constructor(
    private fb: FormBuilder,
    private productApi: ProductApiService,
    private customerApi: CustomerApiService,
    private poApi: PurchaseOrderApiService,
    private userApi: UserApiService,
    private soaApi: SoaApiService,
    private snackbarService: SnackbarService,
    private router: Router,
    private confirmation: ConfirmationService,
    private dialog: MatDialog,
    private transformData: TransformDataService
  ) {}

  ngOnInit(): void {
    this._componentInit();

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

    this.filteredPos = this.searchPoControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterPos(val || '');
      })
    );
  }

  get _customerId() {
    return this.soaForm.get('_customerId') as FormControl;
  }

  async searchId() {
    let createdSoa: any = {};

    const getSoaById$ = this.soaApi.getSoaById(this._id).pipe(
      takeUntil(this.destroyed$),
      catchError((error) => {
        console.error(error);
        return of(false);
      })
    );
    const soaFromResponse = (await firstValueFrom(getSoaById$)) as any;

    if (!soaFromResponse) {
      this.snackbarService.openErrorSnackbar(
        'Error',
        `No SOA was found for the provided ID.`
      );
      this.router.navigate(['portal', 'soa']);
      return;
    }

    createdSoa = soaFromResponse;
    this.soa = createdSoa;

    //If SOA has PO, get its PO
    if (soaFromResponse._purchaseOrderId) {
      const purchaseOrder = await this._getPoById(
        soaFromResponse._purchaseOrderId
      );
      this.searchPoControl.patchValue(purchaseOrder);
      this.usePoCheckChange();
    }

    this._autoFillForm(createdSoa);
  }

  actionEventHandler(e: any) {
    if (e.action.name == 'remove') {
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
    this.soaApi.getMostRecentSoa().subscribe({
      next: (res: any) => {
        res.signatories.forEach((sig: any) => {
          this.listedSignatories.push({
            name: sig.STATIC.name,
            designation: sig.STATIC.designation,
            action: sig.action,
          });
        });
        this._copySignatoriesToSelf();
      },
    });
  }

  updateCellEventHandler(e: {
    newValue: any;
    column: TableColumn;
    element: Product & Pricing;
  }) {
    if (typeof e.column.dotNotationPath == 'string')
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
    this._copySignatoriesToSelf();
  }

  pushToListedProducts(product: Product & Pricing) {
    var li = this.listedItems;
    if (!li.find((o) => o._id === product._id))
      this.listedItems.push({
        ...product,
        STATIC: {
          unit_price: product.price.amount,
          quantity: 1,
          disc: 0,
          total: product.price.amount - product.price.amount * 0,
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

  private _copySignatoriesToSelf() {
    this.listedSignatories.sort((a, b) => {
      var aIndex = SIGNATORY_ACTIONS.findIndex((action) => action === a.action);
      var bIndex = SIGNATORY_ACTIONS.findIndex((action) => action === b.action);
      return aIndex - bIndex;
    });
    this.listedSignatories = [...this.listedSignatories];
    this.listedSignatoriesPage.length = -1;
    setTimeout(() => {
      this.listedSignatoriesPage.length = this.listedSignatories.length;
    }, 20);
  }

  createSOA() {
    const soa = this._formatBodyRequest();
    this.soaApi.createSoa(soa).subscribe({
      next: (res: any) => {
        this.snackbarService.openSuccessSnackbar(
          'Success',
          'SOA Successfully Created.'
        );
        this.router.navigate(['portal', 'soa']);
        this.displayPDF(res);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
      },
    });
  }

  displayPDF(soa: SOA) {
    if (soa._id)
      this.dialog.open(PdfViewerComponent, {
        data: {
          apiCall: this.soaApi.getPdfSoa(soa._id),
          title: 'View SOA Receipt',
        },
        maxWidth: '70rem',
        width: '100%',
        disableClose: true,
        autoFocus: false,
      });
  }

  updateSOA() {
    const soa = this._formatBodyRequest();
    this.soaApi.updateSoaById(this._id, soa).subscribe({
      next: (newSoa: any) => {
        this.snackbarService.openSuccessSnackbar(
          'Update Success',
          `SOA ${newSoa.code?.value} successfully updated.`
        );
        this.router.navigate(['portal', 'soa']);
        this.displayPDF(newSoa);
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
    this._copySignatoriesToSelf();
    this.signatoryControl.reset();
  }

  removeFromListedSignatories(i: number) {
    this.listedSignatories.splice(i, 1);
    this._copySignatoriesToSelf();
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

  private _filterPos(value: string) {
    return this.poApi
      .getPurchaseOrders({ searchText: value, pageSize: 30 })
      .pipe(map((response: any) => response.records));
  }

  displayCustomer(value: any) {
    let displayStr = '';
    if (value?.name) {
      displayStr = value.name;
      if (value.name != value.contactPerson) {
        displayStr += ` (${value.contactPerson})`;
      }
    } else {
      displayStr = value ?? '';
    }
    return displayStr;
  }

  displayPo(value: any) {
    return value?.code?.value ?? '';
  }

  displayUser(value: any) {
    return value.name || value || '';
  }

  confirm() {
    this.confirmation
      .open(
        'Confirmation',
        'You will be adding a <b>Statement Of Account</b>. Would you like to proceed on this action?'
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
    const { mobile, addressBilling, tin } = selectedCustomer;
    this.soaForm.patchValue({
      mobile,
      address: addressBilling,
      tin,
    });
  }

  usePoCheckChange() {
    this.usePurchaseOrder = !this.usePurchaseOrder;

    if (!this.usePurchaseOrder) {
      this.soaForm.patchValue({
        _purchaseOrderId: '',
      });

      this.searchPoControl.reset();
    }
  }

  autofillCustomerDetailsFromPo(po: PurchaseOrder) {
    const { mobile, addressBilling, tin, _id } =
      po._customerId as unknown as Customer;

    this.soaForm.patchValue({
      mobile,
      address: addressBilling,
      tin,
      _customerId: po._customerId,
      _purchaseOrderId: po._id,
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

  private async _componentInit() {
    /**
     * If SOA Update
     */
    if (this._id) {
      this.searchId();
    } else {
      /**
       * If hasTransformData is true, get transformed data and get recent soa signatories to createSoa.
       * Else it is a plain soa create with recent soa signatories
       */
      let createSoa: any = {};
      const hasTransformData =
        this.transformData.verifyTransactionDataFootprint(
          this.transformServiceId
        );

      if (hasTransformData) {
        createSoa = this.transformData.formatDataToRecipient(
          this.transformServiceId
        );

        //Checks if has purchaseOrderId;
        if (createSoa._purchaseOrderId) {
          const purchaseOrder = await this._getPoById(
            createSoa._purchaseOrderId
          );
          this.searchPoControl.patchValue(purchaseOrder);
          this.usePoCheckChange();
        }
      }

      //Get recent SOA for signatories
      const getRecentSoa$ = this.soaApi.getMostRecentSoa().pipe(
        takeUntil(this.destroyed$),
        catchError((error) => {
          console.error(error);
          return error;
        })
      );

      const recentSOA = (await firstValueFrom(getRecentSoa$)) as SOA;

      if (!recentSOA) {
        return;
      }

      createSoa['signatories'] = recentSOA.signatories;
      this._autoFillForm(createSoa);
    }
  }

  private async _getPoById(poId: string) {
    const getPoById$ = this.poApi
      .getPurchaseOrderById(poId)
      .pipe(takeUntil(this.destroyed$));

    const po = await lastValueFrom(getPoById$);
    return po;
  }

  private _formatBodyRequest() {
    const rawSoaForm = this.soaForm.getRawValue() as any;
    let soa: SOA = {
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

    //Purchase Order Id Property Check
    if (rawSoaForm._purchaseOrderId) {
      soa['_purchaseOrderId'] = rawSoaForm._purchaseOrderId;
    }
    return soa;
  }

  private _autoFillForm(soa: any) {
    this.soaForm.patchValue({
      _customerId: soa?._customerId ?? '',
      _purchaseOrderId: soa?._purchaseOrderId ?? '',
      mobile: soa.STATIC?.mobile ?? '',
      address: soa.STATIC?.address ?? '',
      tin: soa.STATIC?.tin ?? '',
      soaDate: soa?.soaDate ?? '',
      remarks: soa?.remarks ?? '',
    });

    if (Array.isArray(soa.items) && soa.items.length > 0) {
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
    }

    if (Array.isArray(soa.signatories) && soa.signatories.length > 0) {
      for (let signatory of soa.signatories) {
        this.listedSignatories.push({
          name: signatory.STATIC.name,
          designation: signatory.STATIC.designation,
          action: signatory.action,
          _id: signatory._userId,
        });
      }
    }

    this.listedDiscounts =
      soa.discounts?.map((a: Discount) => ({ name: a.name, value: a.value })) ||
      [];

    this.listedTaxes =
      soa.taxes?.map((a: Tax) => ({ name: a.name, value: a.value })) || [];

    this._copySignatoriesToSelf();

    this.listedDiscountsPage.length = this.listedDiscounts.length;
    this.listedTaxesPage.length = this.listedSignatories.length;

    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
    // this.soaForm.get('_customerId')?.disable();
    this._calculateSummary();
  }

  ngOnDestroy(): void {
    if (
      this.transformData.getTransformData()?.from !== this.transformServiceId
    ) {
      this.transformData.deleteTransformData();
    }

    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

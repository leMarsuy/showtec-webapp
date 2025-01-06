import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { CustomerType } from '@app/core/enums/customer-type.enum';
import {
  SIGNATORY_ACTIONS,
  SignatoryAction,
} from '@app/core/enums/signatory-action.enum';
import { StockStatus } from '@app/core/enums/stock-status.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Customer } from '@app/core/models/customer.model';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { Product } from '@app/core/models/product.model';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { User } from '@app/core/models/user.model';
import { OutDeliveryDataService } from '@app/modules/portal/pages/out-delivery/out-delivery-data.service';
import { CustomerApiService } from '@app/shared/services/api/customer-api/customer-api.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import {
  TransformDataService,
  TransformReference,
} from '@app/shared/services/data/transform-data/transform-data.service';
import { deepInsert } from '@app/shared/utils/deepInsert';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ConfirmationService } from '../../components/confirmation/confirmation.service';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { SnackbarService } from '../../components/snackbar/snackbar.service';

@Component({
  selector: 'app-out-delivery-form',
  templateUrl: './out-delivery-form.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './out-delivery-form.component.scss',
})
export class OutDeliveryFormComponent implements OnInit, OnDestroy {
  @Input() _id!: string;
  private transformServiceId: TransformReference = 'delivery-receipt';

  signatoryActions = SIGNATORY_ACTIONS;
  serialNumberControl = new FormControl('');
  signatoryControl = new FormControl('');
  errorMessage = '';
  outDelivery!: OutDelivery;

  deliveryForm = this.fb.group({
    _customerId: this.fb.control('', [Validators.required]),
    _purchaseOrderId: this.fb.control(''),
    remarks: this.fb.control(''),
    mobile: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    tin: this.fb.control(''),
    deliveryDate: this.fb.control(new Date(), [Validators.required]),
  });

  usePurchaseOrder = true;
  searchPoControl = new FormControl();

  destroyed$ = new Subject<void>();

  filteredCustomers!: Observable<Customer[]>;
  filteredUsers!: Observable<User[]>;
  filteredPos!: Observable<PurchaseOrder[]>;

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

  listedItems: Array<Product> = [];
  listedItemsColumns: TableColumn[] = [
    {
      label: 'Item',
      dotNotationPath: ['brand', 'model'],
      type: ColumnType.STRING,
      width: '[20rem]',
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

  constructor(
    private productApi: ProductApiService,
    private customerApi: CustomerApiService,
    private poApi: PurchaseOrderApiService,
    private userApi: UserApiService,
    private outdeliveryApi: OutDeliveryApiService,
    private transformDataService: TransformDataService,
    private outDeliveryDataService: OutDeliveryDataService,
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private confirmation: ConfirmationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this._componentInit();

    this.filteredCustomers = this._customerId.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterCustomers(val || '');
      }),
      takeUntil(this.destroyed$),
    );

    this.filteredUsers = this.signatoryControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterUsers(val || '');
      }),
      takeUntil(this.destroyed$),
    );

    this.filteredPos = this.searchPoControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterPos(val || '');
      }),
      takeUntil(this.destroyed$),
    );
  }

  usePoCheckChange() {
    this.usePurchaseOrder = !this.usePurchaseOrder;

    if (!this.usePurchaseOrder) {
      this.deliveryForm.patchValue({
        _purchaseOrderId: '',
      });

      this.searchPoControl.reset();
    }
  }

  private async _outDeliveryUpdateInit() {
    const getOutDeliveryById$ = this.outdeliveryApi
      .getOutDeliveryById(this._id)
      .pipe(
        takeUntil(this.destroyed$),
        catchError((error) => {
          console.error(error);
          return of(false);
        }),
      );
    const response = (await firstValueFrom(getOutDeliveryById$)) as any;

    //Return to OutDelivery List if ID not found
    if (!response) {
      this.snackbarService.openErrorSnackbar(
        'Error',
        'No Out Delivery was found for the provided ID.',
      );
      this.router.navigate([PORTAL_PATHS.deliveryReceipts.relativeUrl]);
      return;
    }

    //If OutDelivery has PO, get its PO
    if (response._purchaseOrderId) {
      this.searchPoControl.disable();
      await this._patchDrPo(response._purchaseOrderId);
    }

    this.outDelivery = response;
    this._autoFillForm(this.outDelivery);
  }

  private _autoFillForm(outDelivery: any) {
    this.deliveryForm.patchValue({
      _customerId: outDelivery?._customerId ?? '',
      _purchaseOrderId: outDelivery?._purchaseOrderId ?? '',
      mobile: outDelivery?.STATIC?.mobile ?? '',
      address: outDelivery?.STATIC?.address ?? '',
      tin: outDelivery?.STATIC?.tin ?? '',
      deliveryDate: outDelivery?.deliveryDate ?? '',
      remarks: outDelivery?.remarks ?? '',
    });

    if (Array.isArray(outDelivery.items) && outDelivery.items.length > 0) {
      for (let item of outDelivery.items) {
        const listedItem = {
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
      }
    }

    if (
      Array.isArray(outDelivery.signatories) &&
      outDelivery.signatories.length > 0
    ) {
      for (let signatory of outDelivery.signatories) {
        this.listedSignatories.push({
          name: signatory.STATIC.name,
          designation: signatory.STATIC.designation,
          action: signatory.action,
          _id: signatory._userId,
        });
      }
    }

    this._copySignatoriesToSelf();

    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
    // this.deliveryForm.get('_customerId')?.disable();
  }

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

        this._copySignatoriesToSelf();
      },
    });
  }

  searchSerialNumber() {
    const serialNumber = this.serialNumberControl.value;
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
    const items = this.listedItems;
    for (let item of items) {
      const index = product.stocks.findIndex(
        (o) => o._id === item.stocks[0]._id,
      );
      if (index >= 0) product.stocks.splice(index, 1);
    }

    if (product.stocks.length <= 0) {
      this.snackbarService.openErrorSnackbar(
        'Ooops',
        'Reached Maximum No. of Available Stocks.',
      );
      return;
    }

    if (!items.find((o) => o.stocks[0]._id === product.stocks[0]._id)) {
      // product.stocks = [product.stocks[0]];
      this.listedItems.push(product);
    }
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
  }

  removeFromListedProducts(i: number) {
    this.listedItems.splice(i, 1);
    this.listedItems = [...this.listedItems];
    this.listedItemsPage.length = this.listedItems.length;
  }

  pushToListedSignatories(user: User) {
    this.listedSignatories.push({
      ...user,
      action: SignatoryAction.REQUESTED,
    });

    this._copySignatoriesToSelf();
    this.signatoryControl.reset();
  }

  removeFromListedSignatories(i: number) {
    this.listedSignatories.splice(i, 1);
    this._copySignatoriesToSelf();
  }

  get _customerId() {
    return this.deliveryForm.get('_customerId') as FormControl;
  }

  get customerName() {
    return (this.deliveryForm.getRawValue()._customerId as unknown as Customer)
      .name;
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

  private _filterPos(value: string) {
    return this.poApi
      .getPurchaseOrders({ searchText: value, pageSize: 30 })
      .pipe(map((response: any) => response.records));
  }

  autofillCustomerDetails(selectedCustomer: Customer) {
    const { mobile, addressDelivery, tin } = selectedCustomer;
    this.deliveryForm.patchValue({
      mobile,
      tin,
      address: addressDelivery,
    });
  }

  autofillCustomerDetailsFromPo(po: PurchaseOrder) {
    const { mobile, addressBilling, tin, _id } =
      po._customerId as unknown as Customer;

    this.deliveryForm.patchValue({
      mobile,
      address: addressBilling,
      tin,
      _customerId: po._customerId as string,
      _purchaseOrderId: po._id,
    });
  }

  updateSignatories(e: any) {
    deepInsert(e.newValue, e.column.dotNotationPath, e.element);
    this._copySignatoriesToSelf();
  }

  private _copySignatoriesToSelf() {
    this.listedSignatories.sort((a, b) => {
      const aIndex = SIGNATORY_ACTIONS.findIndex(
        (action) => action === a.action,
      );
      const bIndex = SIGNATORY_ACTIONS.findIndex(
        (action) => action === b.action,
      );
      return aIndex - bIndex;
    });
    this.listedSignatories = [...this.listedSignatories];
    this.listedSignatoriesPage.length = -1;
    setTimeout(() => {
      this.listedSignatoriesPage.length = this.listedSignatories.length;
    }, 20);
  }

  displayCustomer(value: any) {
    let displayStr = '';
    if (value?.name) {
      displayStr = value.name;
      if (
        value.type === CustomerType.COMPANY ||
        value.name != value.contactPerson
      ) {
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

  displayPoOption(po: any) {
    const companyName = po._customerId.name ?? '';
    const contactPerson = po._customerId.contactPerson ?? '';

    const cleanString = (str: string) => {
      return str.trim().toLowerCase();
    };

    if (cleanString(companyName) === cleanString(contactPerson)) {
      return companyName;
    } else {
      return `${companyName} (${contactPerson})`;
    }
  }

  confirm() {
    this.confirmation
      .open(
        'Confirmation',
        'You will be adding a <b>Delivery Receipt</b>. Would you like to proceed on this action?',
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
        `This will modify the delivery receipt for <b class='text-rose-500'>${this.customerName}</b>. Would you like to proceed with this action?`,
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.updateOutDelivery();
        }
      });
  }

  confirmDiscard() {
    this.confirmation
      .open(
        'Cancel Edit',
        `Any changes will not be saved for <b class='text-rose-500'>${this.customerName}</b>. Are you sure?`,
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.router.navigate([PORTAL_PATHS.deliveryReceipts.relativeUrl]);
        }
      });
  }

  updateOutDelivery() {
    const outdelivery = this._formatBodyRequest();

    this.outdeliveryApi.updateOutDeliveryById(this._id, outdelivery).subscribe({
      next: (res: any) => {
        const od = res;
        this.snackbarService.openSuccessSnackbar(
          'UPDATE_SUCCESS',
          'Successfully Updated D/R: ' +
            od.code?.value +
            ' for ' +
            od.STATIC.name +
            '.',
        );
        this.displayPDF(od);
        this.router.navigate([PORTAL_PATHS.deliveryReceipts.relativeUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message,
        );
      },
    });
  }

  displayPDF(outdelivery: OutDelivery) {
    if (outdelivery._id)
      this.dialog.open(PdfViewerComponent, {
        data: {
          apiCall: this.outdeliveryApi.getPdfOutDelivery(outdelivery._id),
          title: 'View Delivery Receipt',
        },
        maxWidth: '70rem',
        width: '100%',
        disableClose: true,
        autoFocus: false,
      });
  }

  createOutDelivery() {
    const outdelivery = this._formatBodyRequest();

    this.outdeliveryApi.createOutDelivery(outdelivery).subscribe({
      next: (res: any) => {
        this.displayPDF(res);
        this.router.navigate([PORTAL_PATHS.deliveryReceipts.relativeUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message,
        );
      },
    });
  }

  private async _getPoById(poId: string) {
    const getPoById$ = this.poApi.getPurchaseOrderById(poId).pipe(
      takeUntil(this.destroyed$),
      catchError(() => of(false)),
    );
    const po = (await firstValueFrom(getPoById$)) as PurchaseOrder;
    return po;
  }

  private async _componentInit() {
    //If DR Update
    if (this._id) {
      this._outDeliveryUpdateInit();
    } else {
      /**
       * If hasTransformData is true, get transformed data and get recent dr signatories to createOutDelivery.
       * Else it is a plain dr create with recent dr signatories or from clone dr
       */
      let createOutDelivery: any = {};

      //Check transform data service
      const hasTransformData =
        this.transformDataService.verifyTransactionDataFootprint(
          this.transformServiceId,
        );

      if (hasTransformData) {
        createOutDelivery = this.transformDataService.formatDataToRecipient(
          this.transformServiceId,
        );

        this._patchDrPo(createOutDelivery._purchaseOrderId);
      }

      //Check Out Delivery Data Service for Reuse/Clone Out Delivery
      const drClone = this.outDeliveryDataService.OutDelivery;
      if (drClone) {
        Object.assign(createOutDelivery, drClone);
        await this._patchDrPo(createOutDelivery._purchaseOrderId);
      }

      //Get Recent DR for signatories
      const getRecentOutDelivery$ = this.outdeliveryApi
        .getMostRecentOutDelivery()
        .pipe(
          takeUntil(this.destroyed$),
          catchError((error) => {
            console.error(error);
            return of(false);
          }),
        );

      const recentOutDelivery = (await firstValueFrom(
        getRecentOutDelivery$,
      )) as OutDelivery;

      if (recentOutDelivery) {
        createOutDelivery['signatories'] = recentOutDelivery.signatories;
      }

      this._autoFillForm(createOutDelivery);
    }
  }

  private async _patchDrPo(purchaseOrderId: string) {
    //Checks if has purchaseOrderId;
    if (!purchaseOrderId) return;

    const purchaseOrder = await this._getPoById(purchaseOrderId);
    if (!purchaseOrder) return;

    this.searchPoControl.patchValue(purchaseOrder);
  }

  private _formatBodyRequest() {
    const rawOutdelivery = this.deliveryForm.getRawValue() as any;
    let outdelivery: OutDelivery = {
      _customerId: rawOutdelivery._customerId._id,
      deliveryDate: rawOutdelivery.deliveryDate,
      remarks: rawOutdelivery.remarks,
      STATIC: {
        name: rawOutdelivery._customerId.name,
        mobile: rawOutdelivery.mobile,
        address: rawOutdelivery.address,
        tin: rawOutdelivery.tin,
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

    //Purchase Order Id Property Check
    if (rawOutdelivery._purchaseOrderId) {
      outdelivery['_purchaseOrderId'] = rawOutdelivery._purchaseOrderId;
    }

    return outdelivery;
  }

  ngOnDestroy(): void {
    if (
      this.transformDataService.getTransformData()?.from !==
      this.transformServiceId
    ) {
      this.transformDataService.deleteTransformData();
    }

    this.outDeliveryDataService.deleteOutDelivery();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { Signatory } from '@app/core/models/out-delivery.model';
import { Product } from '@app/core/models/product.model';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { Discount, Tax } from '@app/core/models/soa.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';
import { isEmpty } from '@app/shared/utils/objectUtil';

interface Pricing {
  STATIC: {
    unit_price: number;
    quantity: number;
    disc?: number;
    total: number;
  };
}

@Component({
  selector: 'app-upsert-purchase-order',
  templateUrl: './upsert-purchase-order.component.html',
  styleUrl: './upsert-purchase-order.component.scss',
})
export class UpsertPurchaseOrderComponent implements OnInit {
  listedProducts: Array<Product & Pricing> = [];
  listedDiscounts: Discount[] = [];
  listedTaxes: Tax[] = [];
  listedSignatories: any[] = [];

  navIcon = NavIcon;

  isUpdate = false;
  loading = true;

  poSummary = this.fb.group({
    total: this.fb.control(0),
    productDiscount: this.fb.control(0),
    subtotal: this.fb.control(0),
    grandtotal: this.fb.control(0),
  });

  poForm: FormGroup = this.fb.group({
    _customerId: this.fb.control('', [Validators.required]),
    mobile: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    tin: this.fb.control(''),
    purchaseOrderDate: this.fb.control(new Date(), [Validators.required]),
    dueDate: this.fb.control(new Date(), [Validators.required]),
    remarks: this.fb.control(''),
  });

  purchaseOrder!: PurchaseOrder;

  constructor(
    private poApi: PurchaseOrderApiService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmation: ConfirmationService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      /**
       * ? Checking if PurchaseOrderResolver returns PO Data
       */
      if (isEmpty(data)) {
        this.loading = false;
        return;
      }

      this.isUpdate = true;
      this.purchaseOrder = data['purchaseOrder'];
      this.loading = false;
      this._fillForms(this.purchaseOrder);
    });
  }

  get isValid() {
    return (
      this.poForm.valid &&
      this.listedProducts.length !== 0 &&
      this.listedSignatories.length !== 0
    );
  }

  productsEmitHandler(products: Array<Product & Pricing>) {
    this.listedProducts = products;
    this.poForm.markAsDirty();
    this._calculateSummary();
  }

  discountsEmitHandler(discounts: Discount[]) {
    this.listedDiscounts = discounts;
    this.poForm.markAsDirty();
    this._calculateSummary();
  }

  taxesEmitHandler(taxes: Tax[]) {
    this.listedTaxes = taxes;
    this.poForm.markAsDirty();
    this._calculateSummary();
  }

  signatoriesEmitHandler(signatories: Signatory[]) {
    this.listedSignatories = signatories;
    this.poForm.markAsDirty();
    this._calculateSummary();
  }

  navigateBack() {
    this.router.navigate(['portal/purchase-order']);
  }

  confirmDiscard() {
    this.confirmation
      .open('Cancel Edit', `Discard the changes you've made?`)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.navigateBack();
        }
      });
  }

  confirmChanges() {
    const actionMsg = this.isUpdate ? 'update' : 'create';

    this.confirmation
      .open(
        'Before you apply the changes...',
        `Would you like to ${actionMsg} this Purchase Order?`
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const purchaseOrder = this._formatRequestBody();

          if (this.isUpdate && this.purchaseOrder._id) {
            this._updatePurchaseOrder(purchaseOrder, this.purchaseOrder._id);
          } else {
            this._createPurchaseOrder(purchaseOrder);
          }
        }
      });
  }

  private _updatePurchaseOrder(purchaseOrder: PurchaseOrder, id: string) {
    this.loading = true;
    this.snackbar.openLoadingSnackbar('Loading', 'Updating PO');
    this.poApi.updatePurchaseOrderById(id, purchaseOrder).subscribe({
      next: () => {
        this.snackbar.closeLoadingSnackbar();
        this.snackbar.openSuccessSnackbar('Success', 'PO sucessfully updated.');
        this.navigateBack();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loading = false;
        this.snackbar.closeLoadingSnackbar();
        this.snackbar.openErrorSnackbar(err.error.errorCode, err.error.message);
        // this.navigateBack();
      },
    });
  }

  private _createPurchaseOrder(purchaseOrder: PurchaseOrder) {
    this.loading = true;
    this.snackbar.openLoadingSnackbar('Loading', 'Creating PO');
    this.poApi.createPurchaseOrder(purchaseOrder).subscribe({
      next: () => {
        this.loading = false;
        this.snackbar.closeLoadingSnackbar();
        this.snackbar.openSuccessSnackbar('Success', 'PO sucessfully created.');
        this.navigateBack();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loading = false;
        this.snackbar.closeLoadingSnackbar();
        this.snackbar.openErrorSnackbar(err.error.errorCode, err.error.message);
        this.navigateBack();
      },
    });
  }

  private _calculateSummary() {
    const summary = {
      total: 0,
      productDiscount: 0,
      subtotal: 0,
      grandtotal: 0,
    };

    for (var item of this.listedProducts) {
      summary.total += item.STATIC.unit_price * item.STATIC.quantity;
      summary.productDiscount +=
        item.STATIC.unit_price * item.STATIC.quantity * (item.STATIC.disc || 0);
    }

    summary.subtotal = summary.total - summary.productDiscount;

    for (var disc of this.listedDiscounts) {
      summary.subtotal -= disc.value;
    }

    summary.grandtotal = summary.subtotal;

    for (var tax of this.listedTaxes) {
      summary.grandtotal += summary.subtotal * tax.value;
    }

    this.poSummary.setValue(summary);
  }

  private _formatRequestBody() {
    const rawValue = this.poForm.getRawValue() as any;

    const purchaseOrder: any = {
      _customerId: rawValue._customerId._id,
      STATIC: {
        name: rawValue._customerId.name,
        address: rawValue.address,
        mobile: rawValue.mobile,
        tin: rawValue.tin,
      },
      purchaseOrderDate: rawValue.purchaseOrderDate,
      dueDate: rawValue.dueDate,
      signatories: [],
      items: [],
      discounts: this.listedDiscounts,
      taxes: this.listedTaxes,
      remarks: rawValue.remarks,
    };

    this.listedProducts.forEach((product) => {
      purchaseOrder.items.push({
        _productId: product._id,
        STATIC: {
          sku: product.sku,
          brand: product.brand,
          model: product.model,
          classification: product.classification || '-',
          unit_price: product.STATIC.unit_price,
          quantity: product.STATIC.quantity,
          disc: product.STATIC.disc || 0,
          total: product.STATIC.total,
        },
      });
    });

    this.listedSignatories.forEach((signatory) => {
      purchaseOrder.signatories.push({
        _userId: signatory._id,
        STATIC: {
          name: signatory.name,
          designation: signatory.designation,
        },
        action: signatory.action,
      });
    });

    return purchaseOrder;
  }

  private _fillForms(purchaseOrder: any) {
    this.poForm.patchValue({
      _customerId: purchaseOrder._customerId,
      mobile: purchaseOrder.STATIC.mobile,
      address: purchaseOrder.STATIC.address,
      tin: purchaseOrder.STATIC.tin,
      purchaseOrderDate: purchaseOrder.purchaseOrderDate,
      remarks: purchaseOrder.remarks,
    });

    for (let item of purchaseOrder.items) {
      this.listedProducts.push({
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

    purchaseOrder.signatories.forEach((sig: any) => {
      this.listedSignatories.push({
        name: sig.STATIC.name,
        designation: sig.STATIC.designation,
        action: sig.action,
        _id: sig._userId,
      });
    });

    this.listedDiscounts =
      purchaseOrder.discounts?.map((a: any) => ({
        name: a.name,
        value: a.value,
      })) || [];

    this.listedTaxes =
      purchaseOrder.taxes?.map((a: any) => ({
        name: a.name,
        value: a.value,
      })) || [];

    this._calculateSummary();
  }
}
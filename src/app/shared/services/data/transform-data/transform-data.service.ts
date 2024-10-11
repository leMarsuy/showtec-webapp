import { Injectable } from '@angular/core';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { Product } from '@app/core/models/product.model';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { SOA } from '@app/core/models/soa.model';

export type TransformReference = 'purchase-order' | 'soa' | 'delivery-receipt';

export interface TransformDataType {
  from: TransformReference;
  to: TransformReference;
  data: Partial<PurchaseOrder> | Partial<SOA> | Partial<OutDelivery>;
}

@Injectable({
  providedIn: 'root',
})
export class TransformDataService {
  private transformData: TransformDataType | null = null;

  constructor() {}

  getTransformData() {
    return this.transformData;
  }

  setTransformData(transaction: TransformDataType) {
    this.transformData = transaction;
  }

  deleteTransformData() {
    this.transformData = null;
  }

  verifyTransactionDataFootprint(recipient: string) {
    if (!this.transformData) {
      return false;
    }

    if (this.transformData.to === this.transformData.from) {
      this.deleteTransformData();
      console.error('Transaction data footprint error');
      return false;
    }

    if (this.transformData.to !== recipient) {
      this.deleteTransformData();
      console.error('Transaction data access denied');
      return false;
    }

    return true;
  }

  formatDataToRecipient(recipient: string) {
    const verification = this.verifyTransactionDataFootprint(recipient);

    if (!verification) {
      return;
    }

    switch (recipient) {
      case 'purchase-order':
        return this._formatDataToPO();

      case 'delivery-receipt':
        return this._formatDataToDR();

      case 'soa':
        return this._formatDataToSOA();

      //Returns error
      default:
        return;
    }
  }

  aggregateProductPrices(items: any) {
    const remapped: any = [];

    for (const item of items) {
      let foundProduct = remapped.find((findIterate: any) => {
        return findIterate._productId === item._productId._id;
      });

      if (foundProduct) {
        foundProduct.STATIC.quantity++;
        foundProduct.STATIC.total =
          foundProduct.STATIC.quantity * foundProduct.STATIC.unit_price;
      } else {
        const STATIC = {
          sku: item.STATIC.sku,
          brand: item.STATIC.brand,
          model: item.STATIC.model,
          classification: item.STATIC.classification,
          unit_price: item._productId.price.amount,
          disc: 0,
          total: item._productId.price.amount,
          quantity: 1,
        };

        remapped.push({
          _productId: item._productId._id,
          _id: item._id,
          STATIC,
        });
      }
    }
    return remapped;
  }

  private _formatDataToPO() {
    const from = this.transformData?.from;
    const purchaseOrderDate = new Date();
    let purchaseOrder;

    if (from === 'delivery-receipt') {
      const dr = this.transformData?.data as OutDelivery;
      purchaseOrder = {
        _customerId: dr._customerId,
        STATIC: dr.STATIC,
        remarks: dr.remarks,
        items: dr.items,
        purchaseOrderDate,
      };
    } else if (from === 'soa') {
      const soa = this.transformData?.data as SOA;

      purchaseOrder = {
        _customerId: soa._customerId,
        STATIC: soa.STATIC,
        remarks: soa.remarks,
        summary: soa.summary,
        items: soa.items,
        discounts: soa.discounts,
        taxes: soa.taxes,
        purchaseOrderDate,
      };
    }

    return purchaseOrder;
  }

  private _formatDataToDR() {
    const from = this.transformData?.from;
    const deliveryDate = new Date();
    let deliveryReceipt;

    if (from === 'purchase-order') {
      const purchaseOrder = this.transformData?.data as PurchaseOrder;

      deliveryReceipt = {
        _purchaseOrderId: purchaseOrder._id,
        _customerId: purchaseOrder._customerId,
        STATIC: purchaseOrder.STATIC,
        remarks: purchaseOrder.remarks,
        deliveryDate,
      };
    } else if (from === 'soa') {
      const soa = this.transformData?.data as SOA;

      deliveryReceipt = {
        _purchaseOrderId: soa._purchaseOrderId ?? null,
        _customerId: soa._customerId,
        STATIC: soa.STATIC,
        remarks: soa.remarks,
        summary: soa.summary,
        discounts: soa.discounts,
        taxes: soa.taxes,
        deliveryDate,
      };
    }

    return deliveryReceipt;
  }

  private _formatDataToSOA() {
    const from = this.transformData?.from;
    const soaDate = new Date();
    let soa;

    if (from === 'delivery-receipt') {
      const dr = this.transformData?.data as OutDelivery;

      soa = {
        _customerId: dr._customerId,
        STATIC: dr.STATIC,
        remarks: dr.remarks,
        items: dr.items,
        soaDate,
      };
    } else if (from === 'purchase-order') {
      const purchaseOrder = this.transformData?.data as PurchaseOrder;

      soa = {
        _purchaseOrderId: purchaseOrder._id,
        _customerId: purchaseOrder._customerId,
        STATIC: purchaseOrder.STATIC,
        remarks: purchaseOrder.remarks,
        summary: purchaseOrder.summary,
        items: purchaseOrder.items,
        discounts: purchaseOrder.discounts,
        taxes: purchaseOrder.taxes,
        soaDate,
      };
    }

    return soa;
  }
}

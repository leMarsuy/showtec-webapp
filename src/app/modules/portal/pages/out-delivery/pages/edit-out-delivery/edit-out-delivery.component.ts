import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryFormComponent } from '@app/shared/forms/out-delivery-form/out-delivery-form.component';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import {
  TransformDataService,
  TransformDataType,
  TransformReference,
} from '@app/shared/services/data/transform-data/transform-data.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-edit-out-delivery',
  templateUrl: './edit-out-delivery.component.html',
  styleUrl: './edit-out-delivery.component.scss',
})
export class EditOutDeliveryComponent {
  @ViewChild(OutDeliveryFormComponent)
  private form!: OutDeliveryFormComponent;

  hasPurchaseOrderId!: boolean;
  private transformServiceId: TransformReference = 'delivery-receipt';
  _id!: string;
  navIcon = NavIcon;
  loading = false;
  disableScanner = false;

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private transformData: TransformDataService,
    private outDeliveryApi: OutDeliveryApiService,
    private snackbar: SnackbarService,
  ) {
    this.aRoute.data.pipe(take(1)).subscribe((outDelivery: any) => {
      this._id = outDelivery?._id;
      this.disableScanner = [
        OutDeliveryStatus.DELIVERED,
        OutDeliveryStatus.RELEASED,
      ].includes(outDelivery?.status);
      this.hasPurchaseOrderId = !!outDelivery?._purchaseOrderId;
    });
  }

  navigateBack() {
    this.router.navigate([PORTAL_PATHS.deliveryReceipts.relativeUrl]);
  }

  onTransformData(recipient: TransformReference) {
    const { _id } = this.form.outDelivery as OutDelivery;

    this.snackbar.openLoadingSnackbar('Fetching Data', 'Please wait...');
    this.loading = true;

    this.outDeliveryApi
      .getOutDeliveryByIdWithItemPrices(_id as string)
      .subscribe({
        next: (response: unknown) => {
          this._sendTransformData(response, recipient);
          this.loading = false;
          this.snackbar.closeLoadingSnackbar();
        },
        error: ({ error }: HttpErrorResponse) => {
          this.snackbar.closeLoadingSnackbar();
          this.loading = false;
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  private _sendTransformData(outDelivery: any, recipient: string) {
    const items = this.transformData.aggregateProductPrices(outDelivery.items);
    outDelivery.items = items;

    const packet: TransformDataType = {
      from: this.transformServiceId,
      to: recipient as TransformReference,
      data: outDelivery,
    };

    this.transformData.setTransformData(packet);

    switch (recipient) {
      case 'soa':
        this.router.navigate([PORTAL_PATHS.soas.createUrl]);
        break;
      case 'purchase-order':
        this.router.navigate([PORTAL_PATHS.purchaseOrders.createUrl]);
        break;
    }
  }
}

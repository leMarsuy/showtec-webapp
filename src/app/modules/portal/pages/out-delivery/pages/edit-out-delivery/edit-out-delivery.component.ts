import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryFormComponent } from '@app/shared/forms/out-delivery-form/out-delivery-form.component';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import {
  TransformDataService,
  TransformDataType,
  TransformReference,
} from '@app/shared/services/data/transform-data/transform-data.service';

@Component({
  selector: 'app-edit-out-delivery',
  templateUrl: './edit-out-delivery.component.html',
  styleUrl: './edit-out-delivery.component.scss',
})
export class EditOutDeliveryComponent {
  @ViewChild(OutDeliveryFormComponent) private form!: OutDeliveryFormComponent;
  private transformServiceId: TransformReference = 'delivery-receipt';
  _id!: string;
  navIcon = NavIcon;
  loading = false;

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private transformData: TransformDataService,
    private outDeliveryApi: OutDeliveryApiService,
    private snackbar: SnackbarService
  ) {
    aRoute.params.subscribe((res: any) => {
      this._id = res._id;
    });
  }

  navigateBack() {
    this.router.navigate(['portal', 'out-delivery']);
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
        this.router.navigate(['portal', 'soa', 'create']);
        break;
      case 'purchase-order':
        this.router.navigate(['portal', 'purchase-order', 'create']);
        break;
    }
  }
}

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { SOA } from '@app/core/models/soa.model';
import { SoaFormComponent } from '@app/shared/forms/soa-form/soa-form.component';
import { SoaApiService } from '@app/shared/services/api/soa-api/soa-api.service';
import {
  TransformDataService,
  TransformDataType,
  TransformReference,
} from '@app/shared/services/data/transform-data/transform-data.service';
import { map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-edit-soa',
  templateUrl: './edit-soa.component.html',
  styleUrl: './edit-soa.component.scss',
})
export class EditSoaComponent {
  @ViewChild(SoaFormComponent) private form!: SoaFormComponent;
  private transformServiceId: TransformReference = 'soa';

  _id!: string;
  navIcon = NavIcon;
  hasPurchaseId!: boolean;

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private soaApi: SoaApiService,
    private transformData: TransformDataService,
  ) {
    aRoute.params
      .pipe(
        take(1),
        switchMap((res: any) => {
          this._id = res._id;
          return this.soaApi.getSoaById(res._id);
        }),
        map((soa: any) => soa._purchaseOrderId),
      )
      .subscribe((purchaseOrderId: any) => {
        this.hasPurchaseId = !!purchaseOrderId;
      });
  }

  navigateBack() {
    this.router.navigate([PORTAL_PATHS.soas.relativeUrl]);
  }

  onTransformData(recipient: TransformReference) {
    const data = this.form.soa as SOA;
    const packet: TransformDataType = {
      from: this.transformServiceId,
      to: recipient,
      data,
    };
    this.transformData.setTransformData(packet);

    if (recipient === 'purchase-order') {
      this.router.navigate([PORTAL_PATHS.purchaseOrders.createUrl]);
    }

    if (recipient === 'delivery-receipt') {
      this.router.navigate([PORTAL_PATHS.deliveryReceipts.createUrl]);
    }
  }
}

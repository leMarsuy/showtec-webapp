import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { SOA } from '@app/core/models/soa.model';
import { SoaFormComponent } from '@app/shared/forms/soa-form/soa-form.component';
import {
  TransformDataService,
  TransformDataType,
  TransformReference,
} from '@app/shared/services/data/transform-data/transform-data.service';

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

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,

    private transformData: TransformDataService,
  ) {
    aRoute.params.subscribe((res: any) => {
      this._id = res._id;
    });
  }

  navigateBack() {
    this.router.navigate(['portal', 'soa']);
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
      this.router.navigate(['portal', 'purchase-order', 'create']);
    }

    if (recipient === 'delivery-receipt') {
      this.router.navigate(['portal', 'out-delivery', 'create']);
    }
  }
}

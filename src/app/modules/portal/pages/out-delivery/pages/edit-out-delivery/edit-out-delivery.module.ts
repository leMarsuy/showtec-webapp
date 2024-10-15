import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditOutDeliveryRoutingModule } from './edit-out-delivery-routing.module';
import { EditOutDeliveryComponent } from './edit-out-delivery.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OutDeliveryFormModule } from '@app/shared/forms/out-delivery-form/out-delivery-form.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkMenuModule } from '@angular/cdk/menu';

@NgModule({
  declarations: [EditOutDeliveryComponent],
  imports: [
    CommonModule,
    EditOutDeliveryRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CdkMenuModule,
    OutDeliveryFormModule,
  ],
})
export class EditOutDeliveryModule {}

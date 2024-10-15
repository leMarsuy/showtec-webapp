import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateOutDeliveryRoutingModule } from './create-out-delivery-routing.module';
import { CreateOutDeliveryComponent } from './create-out-delivery.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OutDeliveryFormModule } from '@app/shared/forms/out-delivery-form/out-delivery-form.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [CreateOutDeliveryComponent],
  imports: [
    CommonModule,
    CreateOutDeliveryRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    OutDeliveryFormModule,
  ],
})
export class CreateOutDeliveryModule {}

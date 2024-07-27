import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditOutDeliveryRoutingModule } from './edit-out-delivery-routing.module';
import { EditOutDeliveryComponent } from './edit-out-delivery.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OutDeliveryFormModule } from '@app/shared/components/out-delivery-form/out-delivery-form.module';

@NgModule({
  declarations: [EditOutDeliveryComponent],
  imports: [
    CommonModule,
    EditOutDeliveryRoutingModule,
    MatIconModule,
    MatButtonModule,
    OutDeliveryFormModule,
  ],
})
export class EditOutDeliveryModule {}

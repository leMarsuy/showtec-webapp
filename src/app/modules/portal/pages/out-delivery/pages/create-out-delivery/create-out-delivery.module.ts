import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateOutDeliveryRoutingModule } from './create-out-delivery-routing.module';
import { CreateOutDeliveryComponent } from './create-out-delivery.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CreateOutDeliveryComponent],
  imports: [
    CommonModule,
    CreateOutDeliveryRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class CreateOutDeliveryModule {}

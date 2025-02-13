import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OutDeliveryReleasingRoutingModule } from './out-delivery-releasing-routing.module';
import { OutDeliveryReleasingComponent } from './out-delivery-releasing.component';

@NgModule({
  declarations: [OutDeliveryReleasingComponent],
  imports: [CommonModule, OutDeliveryReleasingRoutingModule],
})
export class OutDeliveryReleasingModule {}

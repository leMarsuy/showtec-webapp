import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OutDeliveryReleasingRoutingModule } from './out-delivery-releasing-routing.module';
import { OutDeliveryReleasingComponent } from './out-delivery-releasing.component';
import { OutDeliveryReleasingService } from './out-delivery-releasing.service';

@NgModule({
  declarations: [OutDeliveryReleasingComponent],
  imports: [CommonModule, OutDeliveryReleasingRoutingModule],
  providers: [OutDeliveryReleasingService],
})
export class OutDeliveryReleasingModule {}

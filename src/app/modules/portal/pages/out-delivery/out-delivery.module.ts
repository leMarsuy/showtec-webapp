import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutDeliveryRoutingModule } from './out-delivery-routing.module';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { OutDeliveryComponent } from './out-delivery.component';

@NgModule({
  declarations: [OutDeliveryComponent],
  imports: [CommonModule, OutDeliveryRoutingModule, ContentHeaderModule],
})
export class OutDeliveryModule {}

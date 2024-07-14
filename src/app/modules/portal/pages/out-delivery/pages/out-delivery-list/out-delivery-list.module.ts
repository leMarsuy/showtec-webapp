import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutDeliveryListRoutingModule } from './out-delivery-list-routing.module';
import { TableModule } from '@app/shared/components/table/table.module';
import { OutDeliveryListComponent } from './out-delivery-list.component';

@NgModule({
  declarations: [OutDeliveryListComponent],
  imports: [CommonModule, OutDeliveryListRoutingModule, TableModule],
})
export class OutDeliveryListModule {}

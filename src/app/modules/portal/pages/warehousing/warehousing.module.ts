import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { WarehousingRoutingModule } from './warehousing-routing.module';
import { WarehousingComponent } from './warehousing.component';

@NgModule({
  declarations: [WarehousingComponent],
  imports: [CommonModule, WarehousingRoutingModule, ContentHeaderModule],
})
export class WarehousingModule {}

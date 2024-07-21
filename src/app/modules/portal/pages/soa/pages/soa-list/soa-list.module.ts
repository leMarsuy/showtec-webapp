import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoaListRoutingModule } from './soa-list-routing.module';
import { SoaListComponent } from './soa-list.component';

@NgModule({
  declarations: [SoaListComponent],
  imports: [CommonModule, SoaListRoutingModule],
})
export class SoaListModule {}

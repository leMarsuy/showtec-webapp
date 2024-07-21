import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoaRoutingModule } from './soa-routing.module';
import { SoaComponent } from './soa.component';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';

@NgModule({
  declarations: [SoaComponent],
  imports: [CommonModule, SoaRoutingModule, ContentHeaderModule],
})
export class SoaModule {}

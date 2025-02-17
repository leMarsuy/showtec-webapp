import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousingRoutingModule } from './warehousing-routing.module';
import { WarehousingComponent } from './warehousing.component';


@NgModule({
  declarations: [
    WarehousingComponent
  ],
  imports: [
    CommonModule,
    WarehousingRoutingModule
  ]
})
export class WarehousingModule { }

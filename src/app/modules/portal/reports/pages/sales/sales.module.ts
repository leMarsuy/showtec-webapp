import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SalesBreakdownComponent } from './cards/sales-breakdown/sales-breakdown.component';
import { DailySalesComponent } from './cards/daily-sales/daily-sales.component';

@NgModule({
  declarations: [SalesComponent, SalesBreakdownComponent, DailySalesComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    MatIconModule,
    MatButtonModule,
    NgApexchartsModule,
  ],
})
export class SalesModule {}

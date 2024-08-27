import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SalesBreakdownComponent } from './cards/sales-breakdown/sales-breakdown.component';
import { DailySalesComponent } from './cards/daily-sales/daily-sales.component';
import { TotalSalesComponent } from './cards/total-sales/total-sales.component';
import { TotalBalanceComponent } from './cards/total-balance/total-balance.component';
import { TotalPaidComponent } from './cards/total-paid/total-paid.component';

@NgModule({
  declarations: [
    SalesComponent,
    SalesBreakdownComponent,
    DailySalesComponent,
    TotalSalesComponent,
    TotalBalanceComponent,
    TotalPaidComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    MatIconModule,
    MatButtonModule,
    NgApexchartsModule,
  ],
})
export class SalesModule {}

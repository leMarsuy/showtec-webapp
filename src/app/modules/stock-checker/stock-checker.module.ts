import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockCheckerRoutingModule } from './stock-checker-routing.module';
import { StockCheckerComponent } from './stock-checker.component';
import { HeaderModule } from './components/header/header.module';

@NgModule({
  declarations: [StockCheckerComponent],
  imports: [CommonModule, StockCheckerRoutingModule, HeaderModule],
})
export class StockCheckerModule {}

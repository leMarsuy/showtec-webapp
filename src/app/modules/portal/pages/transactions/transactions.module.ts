import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionListModule } from './pages/transaction-list/transaction-list.module';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';

@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    TransactionListModule,
    ContentHeaderModule,
  ],
})
export class TransactionsModule {}

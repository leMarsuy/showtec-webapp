import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionListRoutingModule } from './transaction-list-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableModule } from '@app/shared/components/table/table.module';
import { DateFilterInputModule } from '@app/shared/components/date-filter-input/date-filter-input.module';
import { TransactionListComponent } from './transaction-list.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [TransactionListComponent],
  exports: [TransactionListComponent],
  imports: [
    CommonModule,
    TransactionListRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TableModule,
    DateFilterInputModule,
  ],
})
export class TransactionListModule {}

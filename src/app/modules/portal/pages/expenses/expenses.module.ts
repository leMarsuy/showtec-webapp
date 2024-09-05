import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpsertExpenseComponent } from './upsert-expense/upsert-expense.component';
import { ExpenseFormModule } from '@app/shared/forms/expense-form/expense-form.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TableModule } from '@app/shared/components/table/table.module';

@NgModule({
  declarations: [ExpensesComponent, UpsertExpenseComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExpensesRoutingModule,
    ExpenseFormModule,
    ContentHeaderModule,
    TableModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ExpensesModule {}

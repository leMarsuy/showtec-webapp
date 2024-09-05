import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExpenseFormComponent } from './expense-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [ExpenseFormComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ExpenseFormComponent],
})
export class ExpenseFormModule {}

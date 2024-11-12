import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFilterInputComponent } from './date-filter-input.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { DateRangeFilterComponent } from './date-range-filter/date-range-filter.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DateFilterInputComponent, DateRangeFilterComponent],
  exports: [DateFilterInputComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class DateFilterInputModule {}

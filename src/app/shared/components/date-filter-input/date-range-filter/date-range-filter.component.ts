import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrl: './date-range-filter.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class DateRangeFilterComponent {
  dateRange: FormGroup = this.fb.group({
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<DateRangeFilterComponent>,
  ) {}

  get isEndGreaterThenStart() {
    const startDateControl = this.dateRange.get('startDate')?.value;
    const endDateControl = this.dateRange.get('endDate')?.value;

    if (!startDateControl) return false;
    if (!endDateControl) return false;

    const startDate = new Date(startDateControl).getTime();
    const endDate = new Date(endDateControl).getTime();

    return endDate >= startDate;
  }

  onSubmit() {
    this.dialogRef.close(this.dateRange.getRawValue());
  }
}

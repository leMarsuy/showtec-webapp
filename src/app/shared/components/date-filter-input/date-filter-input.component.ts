import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DATE_FILTER_MENU_OPTIONS,
  DateFilterType,
} from '@app/core/enums/date-filter.enum';
import { formatDate } from '@app/shared/utils/dateUtil';
import { DateRangeFilterComponent } from './date-range-filter/date-range-filter.component';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-date-filter-input',
  templateUrl: './date-filter-input.component.html',
  styleUrl: './date-filter-input.component.scss',
})
export class DateFilterInputComponent {
  @Output() dateFilterSelected = new EventEmitter<any>();

  private readonly dialog = inject(MatDialog);

  filterDateDisplay = 'All Time';
  tableFilterDates = DATE_FILTER_MENU_OPTIONS;

  /**
   *
   * @param action {"this-week" | "this-month" | "this-year" | "" - All Time | "custom" - open modal}
   */
  onFilterDateChange(dateFilterType: DateFilterType) {
    if (dateFilterType !== 'date-range') {
      this.filterDateDisplay = this._updateFilterDateDisplay(dateFilterType);
      this.dateFilterSelected.emit(dateFilterType);
      return;
    }

    this.dialog
      .open(DateRangeFilterComponent)
      .afterClosed()
      .pipe(
        filter((result) => result),
        map((result) => result),
      )
      .subscribe({
        next: (dateRangeResult) => {
          this.filterDateDisplay = this._updateFilterDateDisplay(
            dateFilterType,
            dateRangeResult,
          );

          this.dateFilterSelected.emit({
            filter: dateFilterType,
            dateRange: dateRangeResult,
          });
        },
      });
  }

  private _updateFilterDateDisplay(
    dateFilterType: DateFilterType,
    dateRange?: any,
  ): string {
    let display = 'All Time';
    switch (dateFilterType) {
      case DateFilterType.THIS_WEEK:
        display = 'This Week';
        break;
      case DateFilterType.THIS_MONTH:
        display = 'This Month';
        break;
      case DateFilterType.THIS_YEAR:
        display = 'This Year';
        break;
      case DateFilterType.DATE_RANGE: {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);

        const startFormat = formatDate(startDate);
        const endFormat = formatDate(endDate);
        display = `${startFormat} - ${endFormat}`;
        break;
      }
      default:
        break;
    }

    return display;
  }
}

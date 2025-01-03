import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class DateFilterInputComponent implements OnInit, OnChanges {
  @Input() initialValue: any = DateFilterType.THIS_YEAR;
  dateRange!: any;

  @Output() dateFilterSelected = new EventEmitter<any>();

  private readonly dialog = inject(MatDialog);
  readonly tableFilterDates = DATE_FILTER_MENU_OPTIONS;

  filterDateDisplay!: string;

  // get filterDateDisplay() {
  //   return this._updateFilterDateDisplay(this.initialValue, this.dateRange);
  // }

  ngOnInit(): void {
    this._updateFilterDateDisplay(this.initialValue, this.dateRange);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !changes['initialValue'].firstChange &&
      changes['initialValue'].previousValue
    ) {
      this._updateFilterDateDisplay(this.initialValue, this.dateRange);
    }
  }

  /**
   *
   * @param action {"this-week" | "this-month" | "this-year" | "" - All Time | "custom" - open modal}
   */
  onFilterDateChange(dateFilterType: DateFilterType) {
    if (dateFilterType !== 'date-range') {
      this.dateFilterSelected.emit(dateFilterType);
      return;
    }

    this.dialog
      .open(DateRangeFilterComponent)
      .afterClosed()
      .pipe(
        filter((result) => result),
        map((result) => result)
      )
      .subscribe({
        next: (dateRangeResult) => {
          this.dateRange = dateRangeResult;

          this.dateFilterSelected.emit({
            filter: dateFilterType,
            dateRange: dateRangeResult,
          });
        },
      });
  }

  private _updateFilterDateDisplay(dateFilterType: any, dateRange?: any) {
    let display = 'All Time';

    if (typeof dateFilterType !== 'object') {
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
        default:
          break;
      }
    } else {
      switch (dateFilterType.filter) {
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
    }

    this.filterDateDisplay = display;
  }
}

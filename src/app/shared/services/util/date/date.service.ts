import { Injectable } from '@angular/core';
import { QueryParams } from '@app/core/interfaces/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private readonly ONE_DAY = 24 * 60 * 60 * 1000;
  constructor() {}

  getDateDiffInDays(firstDate: Date, secondDate: Date) {
    return Math.round(this.getDiff(firstDate, secondDate) / this.ONE_DAY);
  }

  getDateDiffInMonths(firstDate: Date, secondDate: Date) {
    return Math.round(this.getDiff(firstDate, secondDate) / this.ONE_DAY);
  }

  getDateDiffInYears(firstDate: Date, secondDate: Date) {
    return Math.round(this.getDiff(firstDate, secondDate) / this.ONE_DAY);
  }

  getPastDate(date: Date, pastDays: number) {
    return new Date(date.setDate(date.getDate() - pastDays));
  }

  getDateFloor(date: Date) {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  getDateCeil(date: Date) {
    date.setHours(23, 59, 59, 99);
    return date;
  }

  formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    const format = options ?? {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-US', format);
  }

  getDiff(firstDate: Date, secondDate: Date) {
    return new Date(secondDate).getTime() - new Date(firstDate).getTime();
  }

  dateToQueryParam(date: any) {
    let formattedDate: any = date;

    if (date && typeof date === 'object') {
      const objectToString = JSON.stringify(date);
      formattedDate = objectToString;
    }

    return formattedDate;
  }
}

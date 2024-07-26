import { Pipe, PipeTransform } from '@angular/core';
import { AgingType } from '@app/core/enums/aging-type.enum';
import { getDateDiffInDays } from '@app/shared/utils/dateUtil';

@Pipe({
  name: 'aging',
  standalone: true,
})
export class AgingPipe implements PipeTransform {
  transform(value: string, aging: AgingType): string {
    // switch (aging) {
    // case AgingType.DAYS:
    return this.getAgeInDays(new Date(value));

    // case AgingType.MONTHS:
    //   return getDateDiffInDays(new Date(), new Date(value));

    // case AgingType.YEARS:
    //   return getDateDiffInDays(new Date(), new Date(value));
    // }
  }

  getAgeInDays(date: Date) {
    var diff = getDateDiffInDays(new Date(), new Date(date));

    if (diff == 1) return `Tomorrow`;

    if (diff == -1) return `Yesterday`;

    if (diff > 0) return `In ${diff} days`;

    if (diff < 0) return `${Math.abs(diff)} days ago`;

    return 'Today';
  }
}

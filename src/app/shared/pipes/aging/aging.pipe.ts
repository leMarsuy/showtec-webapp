import { Pipe, PipeTransform } from '@angular/core';
import { AgingType } from '@app/core/enums/aging-type.enum';
import { getDateDiffInDays } from '@app/shared/utils/dateUtil';

@Pipe({
  name: 'aging',
  standalone: true,
})
export class AgingPipe implements PipeTransform {
  transform(value: string, aging: AgingType): number {
    switch (aging) {
      case AgingType.DAYS:
        return getDateDiffInDays(new Date(), new Date(value));

      case AgingType.MONTHS:
        return getDateDiffInDays(new Date(), new Date(value));

      case AgingType.YEARS:
        return getDateDiffInDays(new Date(), new Date(value));
    }
  }
}

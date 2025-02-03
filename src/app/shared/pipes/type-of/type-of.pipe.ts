import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeOf',
  standalone: true,
})
export class TypeOfPipe implements PipeTransform {
  transform(value: any, type: string): string | boolean {
    if (!type) {
      return typeof value;
    }

    return typeof value === type;
  }
}

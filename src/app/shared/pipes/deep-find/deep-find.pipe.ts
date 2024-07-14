import { Pipe, PipeTransform } from '@angular/core';
import { deepFind } from '../../utils/deepfind';

@Pipe({
  name: 'deepFind',
  standalone: true,
})
export class DeepFindPipe implements PipeTransform {
  transform(path: string, obj: any): any {
    return deepFind(obj, path);
  }
}

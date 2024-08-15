import { Pipe, PipeTransform } from '@angular/core';
import { deepFind } from '../../utils/deepfind';

@Pipe({
  name: 'deepFind',
  standalone: true,
})
export class DeepFindPipe implements PipeTransform {
  transform(path: string | string[], obj: any): any {
    if (typeof path == 'string') {
      return deepFind(obj, path);
    } else {
      var str = '';
      for (let p of path) {
        str += deepFind(obj, p) + ' ';
      }
      return str.trim();
    }
  }
}

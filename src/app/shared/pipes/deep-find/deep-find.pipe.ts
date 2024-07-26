import { Pipe, PipeTransform } from '@angular/core';
import { deepFind } from '../../utils/deepfind';

@Pipe({
  name: 'deepFind',
  standalone: true,
})
export class DeepFindPipe implements PipeTransform {
  transform(path: string, obj: any): any {
    if (typeof path == 'string') return deepFind(obj, path);

    return '=';
    var value = '';
    // for (let p of path) {
    //   value += ' ' + deepFind(p, obj);
    // }
  }
}

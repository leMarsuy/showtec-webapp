import { Injectable } from '@angular/core';
import { ObjectService } from './object/object.service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(public object: ObjectService) {}
}

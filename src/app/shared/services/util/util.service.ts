import { Injectable } from '@angular/core';
import { ObjectService } from './object/object.service';
import { DateService } from './date/date.service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(
    public object: ObjectService,
    public date: DateService,
  ) {}
}

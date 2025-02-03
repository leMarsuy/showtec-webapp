import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ClassificationOption {
  classification: string;
  selected: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StockCheckerService {
  private isUser!: boolean;
  private classificationFilterSubject = new BehaviorSubject<
    ClassificationOption[]
  >([]);

  classificationFilter$: Observable<ClassificationOption[]> =
    this.classificationFilterSubject.asObservable();

  setClassifications(classifications: string[]) {
    const classificationRemap = classifications.map((classification) => ({
      classification,
      selected: false,
    }));
    this.classificationFilterSubject.next(classificationRemap);
  }

  getClassifications() {
    return this.classificationFilterSubject.getValue();
  }

  getSelectedClassifications() {
    const getSelected = this.classificationFilterSubject.getValue();
    return getSelected
      .filter((item) => item['selected'])
      .map((item) => item.classification.replace(' ', '_'))
      .join(',');
  }

  isUserSession() {
    return this.isUser;
  }

  setIsUser(isUser: boolean) {
    this.isUser = isUser;
  }
}

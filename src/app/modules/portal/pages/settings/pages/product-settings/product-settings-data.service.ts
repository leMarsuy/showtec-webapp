import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductClassificationDataService {
  private readonly classificationSubject = new BehaviorSubject<string[]>([]);

  private classificationsBackup: string[] = [];
  classifications$: Observable<string[]> =
    this.classificationSubject.asObservable();

  setClassifications(classifications: string[]) {
    this.classificationSubject.next(classifications);
    this.classificationsBackup = [...classifications];
  }

  getClassifications() {
    return this.classificationSubject.getValue();
  }

  addClassfication(newClassification: string) {
    const classifications = [
      ...this.classificationSubject.getValue(),
      newClassification,
    ];
    this.classificationSubject.next([
      ...this.sortClassifications(classifications),
    ]);
  }

  updateClassification(index: number, newClassification: string) {
    const classifications = this.classificationSubject.getValue();
    classifications[index] = newClassification;
    this.classificationSubject.next([
      ...this.sortClassifications(classifications),
    ]);
  }

  deleteClassification(indexToBeDeleted: number) {
    const classifications = this.classificationSubject.getValue();
    classifications.splice(indexToBeDeleted, 1);
    this.classificationSubject.next([
      ...this.sortClassifications(classifications),
    ]);
  }

  undoClassificationChanges() {
    this.classificationSubject.next(this.classificationsBackup);
  }

  private sortClassifications(classifications: string[]): string[] {
    return classifications.sort((a: string, b: string) => a.localeCompare(b));
  }

  isClassificationDuplicate(category: string): boolean {
    const classifications = this.classificationSubject.getValue();
    return classifications.includes(category);
  }
}

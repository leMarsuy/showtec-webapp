import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountTitle } from '../../../vouchers/pages/upsert-voucher/account-title.list';
import { ObjectService } from '@app/shared/services/util/object/object.service';

@Injectable({
  providedIn: 'root',
})
export class DistributionOfAccountDataService {
  private categoriesSubject = new BehaviorSubject<string[]>([]);
  private titlesSubject = new BehaviorSubject<AccountTitle[]>([]);

  categories$: Observable<string[]> = this.categoriesSubject.asObservable();
  titles$: Observable<AccountTitle[]> = this.titlesSubject.asObservable();

  // ===== CATEGORY ======
  private categoriesBackup: string[] = [];

  setCategories(categories: string[]) {
    this.categoriesSubject.next(categories);
    this.categoriesBackup = [...categories];
  }

  getCategories() {
    return this.categoriesSubject.getValue();
  }

  addCategory(newCategory: string) {
    const categories = [...this.categoriesSubject.getValue(), newCategory];
    this.categoriesSubject.next([...this.sortCategories(categories)]);
  }

  updateCategory(index: number, newCategory: string) {
    const categories = this.categoriesSubject.getValue();
    categories[index] = newCategory;
    this.categoriesSubject.next([...this.sortCategories(categories)]);
  }

  deleteCategory(indexToBeDeleted: number) {
    const categories = this.categoriesSubject.getValue();
    categories.splice(indexToBeDeleted, 1);
    this.categoriesSubject.next([...this.sortCategories(categories)]);
  }

  undoCategoryChanges() {
    this.categoriesSubject.next(this.categoriesBackup);
  }

  private sortCategories(categories: string[]): string[] {
    return categories.sort((a: string, b: string) => a.localeCompare(b));
  }

  isCategoryDuplicate(category: string): boolean {
    const categories = this.categoriesSubject.getValue();
    return categories.includes(category);
  }

  // ===== TITLES ======
  private titlesBackup: AccountTitle[] = [];

  setTitles(titles: AccountTitle[]) {
    this.titlesSubject.next(titles);
    this.titlesBackup = [...titles];
  }

  getTitles() {
    return this.titlesSubject.getValue();
  }

  addTitle(newTitle: AccountTitle) {
    const titles = [...this.titlesSubject.getValue(), newTitle];
    this.titlesSubject.next([...this.sortTitles(titles)]);
  }

  updateTitle(index: number, newTitle: AccountTitle) {
    const titles = this.titlesSubject.getValue();
    titles[index] = newTitle;
    this.titlesSubject.next([...this.sortTitles(titles)]);
  }

  deleteTitle(indexToBeDeleted: number) {
    const titles = this.titlesSubject.getValue();
    titles.splice(indexToBeDeleted, 1);
    this.titlesSubject.next([...this.sortTitles(titles)]);
  }

  undoTitlesChanges() {
    this.titlesSubject.next(this.titlesBackup);
  }

  private sortTitles(titles: AccountTitle[]): AccountTitle[] {
    return titles.sort((a: AccountTitle, b: AccountTitle) =>
      a.name.localeCompare(b.name)
    );
  }

  isTitleDuplicate(title: AccountTitle): boolean {
    const titles = this.titlesSubject.getValue();
    return titles.some(
      (temp: AccountTitle) =>
        temp.name === title.name && temp.category === title.category
    );
  }

  onDestroyTitle() {
    // this.titlesSubject.next([]);
    // this.titlesSubject.complete();
  }
}

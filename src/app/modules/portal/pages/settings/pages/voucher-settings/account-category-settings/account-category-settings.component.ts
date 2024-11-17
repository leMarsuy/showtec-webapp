import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { UpsertCategoryComponent } from './upsert-category/upsert-category.component';
import { DistributionOfAccountDataService } from '../voucher-settings-data.service';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';

@Component({
  selector: 'app-account-category-settings',
  templateUrl: './account-category-settings.component.html',
  styleUrl: './account-category-settings.component.scss',
})
export class AccountCategorySettingsComponent implements OnInit, OnDestroy {
  @Output() dirtyState = new EventEmitter<boolean>();
  categories!: string[];
  isDirty = false;

  destroyed$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly distributionOfAccountDataService: DistributionOfAccountDataService,
    private readonly snackbar: SnackbarService,
    private readonly confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.distributionOfAccountDataService.categories$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  openUpsertCategory(category?: string, index?: number) {
    const isUpdate = category !== undefined && index !== undefined;

    this.dialog
      .open(UpsertCategoryComponent, {
        data: category ?? null,
        disableClose: true,
        autoFocus: false,
        width: '100rem',
      })
      .afterClosed()
      .subscribe({
        next: (category) => {
          if (!category) return;

          if (
            this.distributionOfAccountDataService.isCategoryDuplicate(category)
          ) {
            this.snackbar.openErrorSnackbar('Error', 'Category already exists');
            return;
          }

          this.isDirty = true;
          if (isUpdate) {
            this.distributionOfAccountDataService.updateCategory(
              index,
              category
            );
          } else {
            this.distributionOfAccountDataService.addCategory(category);
          }
          this._emitDirtyState();
        },
      });
  }

  removeCategoryAt(category: string, index: number) {
    this.confirmation
      .open('Category Deletion', `Do you want to remove "<b>${category}</b>"?`)
      .afterClosed()
      .pipe(filter((result) => result))
      .subscribe(() => {
        this.isDirty = true;
        this._emitDirtyState();
        this.distributionOfAccountDataService.deleteCategory(index);
      });
  }

  undoCategoryChanges() {
    this.isDirty = false;
    this._emitDirtyState();
    this.distributionOfAccountDataService.undoCategoryChanges();
  }

  private _emitDirtyState() {
    this.dirtyState.emit(this.isDirty);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductClassificationDataService } from '../product-settings-data.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { UpsertProductClassificationComponent } from './upsert-product-classification/upsert-product-classification.component';

@Component({
  selector: 'app-product-classification-settings',
  templateUrl: './product-classification-settings.component.html',
  styleUrl: './product-classification-settings.component.scss',
})
export class ProductClassificationSettingsComponent
  implements OnInit, OnDestroy
{
  @Output() dirtyState = new EventEmitter<boolean>();
  classifications!: string[];
  isDirty = false;

  destroyed$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly classificationDataService: ProductClassificationDataService,
    private readonly snackbar: SnackbarService,
    private readonly confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.classificationDataService.classifications$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((classifications) => {
        this.classifications = classifications;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  openUpsertClassification(classification?: string, index?: number) {
    const isUpdate = classification !== undefined && index !== undefined;

    this.dialog
      .open(UpsertProductClassificationComponent, {
        data: classification ?? null,
        disableClose: true,
        autoFocus: false,
        width: '100rem',
      })
      .afterClosed()
      .subscribe({
        next: (classification) => {
          if (!classification) return;

          if (
            this.classificationDataService.isClassificationDuplicate(
              classification
            )
          ) {
            this.snackbar.openErrorSnackbar(
              'Error',
              'Product Classification already exists'
            );
            return;
          }

          this.isDirty = true;
          if (isUpdate) {
            this.classificationDataService.updateClassification(
              index,
              classification
            );
          } else {
            this.classificationDataService.addClassfication(classification);
          }
          this._emitDirtyState();
        },
      });
  }

  removeCategoryAt(classification: string, index: number) {
    this.confirmation
      .open(
        'Product Classification',
        `Do you want to remove "<b>${classification}</b>"?`
      )
      .afterClosed()
      .pipe(filter((result) => result))
      .subscribe(() => {
        this.isDirty = true;
        this._emitDirtyState();
        this.classificationDataService.deleteClassification(index);
      });
  }

  undoCategoryChanges() {
    this.isDirty = false;
    this._emitDirtyState();
    this.classificationDataService.undoClassificationChanges();
  }

  private _emitDirtyState() {
    this.dirtyState.emit(this.isDirty);
  }
}

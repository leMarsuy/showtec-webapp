import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ACCOUNT_TITLES,
  AccountTitle,
} from '@app/modules/portal/pages/vouchers/pages/upsert-voucher/account-title.list';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { ObjectService } from '@app/shared/services/util/object/object.service';
import {
  Observable,
  Subject,
  startWith,
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  of,
  filter,
} from 'rxjs';
import { UpsertTitleComponent } from './upsert-title/upsert-title.component';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { ConfigApiService } from '@app/shared/services/api/config-apo/config-api.service';
import { DistributionOfAccountDataService } from '../voucher-settings-data.service';

@Component({
  selector: 'app-account-title-settings',
  templateUrl: './account-title-settings.component.html',
  styleUrl: './account-title-settings.component.scss',
})
export class AccountTitleSettingsComponent implements OnInit, OnDestroy {
  @Output() dirtyState = new EventEmitter<boolean>();
  categories!: string[];
  titles!: AccountTitle[];
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
    this.distributionOfAccountDataService.titles$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((titles) => {
        this.titles = titles;
      });
  }

  displayCategory(category: string) {
    return category;
  }

  openUpsertTitle(accountTitle?: AccountTitle, index?: number) {
    const isUpdate = accountTitle !== undefined && index !== undefined;

    this.dialog
      .open(UpsertTitleComponent, {
        data: {
          accountTitle,
          categories: this.categories,
        },
        disableClose: true,
        autoFocus: false,
        width: '100rem',
      })
      .afterClosed()
      .subscribe({
        next: (title) => {
          if (!title) return;

          if (this.distributionOfAccountDataService.isTitleDuplicate(title)) {
            this.snackbar.openErrorSnackbar(
              'Error',
              'Account Title already exists'
            );
            return;
          }

          this.isDirty = true;
          if (isUpdate) {
            this.distributionOfAccountDataService.updateTitle(index, title);
          } else {
            this.distributionOfAccountDataService.addTitle(title);
          }
          this._emitDirtyState();
        },
      });
  }

  removeCategoryAt(title: AccountTitle, index: number) {
    this.confirmation
      .open('Title Deletion', `Do you want to remove "<b>${title.name}</b>"?`)
      .afterClosed()
      .pipe(filter((result) => result))
      .subscribe(() => {
        this.isDirty = true;
        this._emitDirtyState();
        this.distributionOfAccountDataService.deleteTitle(index);
      });
  }

  undoCategoryChanges() {
    this.isDirty = false;
    this._emitDirtyState();
    this.distributionOfAccountDataService.undoTitlesChanges();
  }

  private _emitDirtyState() {
    this.dirtyState.emit(this.isDirty);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

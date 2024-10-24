import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import {
  SIGNATORY_ACTIONS,
  SignatoryAction,
} from '@app/core/enums/signatory-action.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Signatory } from '@app/core/models/out-delivery.model';
import { User } from '@app/core/models/user.model';
import { UserApiService } from '@app/shared/services/api/user-api/user-api.service';
import { deepInsert } from '@app/shared/utils/deepInsert';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-signatories-form',
  templateUrl: './signatories-form.component.html',
  styleUrl: './signatories-form.component.scss',
})
export class SignatoriesFormComponent implements OnInit, OnDestroy {
  @Input() signatories: Array<any> = [];
  @Input({ alias: 'loading' }) isLoading = false;
  @Output() signatoriesEmitter = new EventEmitter<Array<any>>();

  columns: TableColumn[] = [
    {
      label: 'Name',
      dotNotationPath: 'name',
      type: ColumnType.STRING,
    },
    {
      label: 'Designation',
      dotNotationPath: 'designation',
      type: ColumnType.STRING,
    },
    {
      label: 'Action',
      dotNotationPath: 'action',
      type: ColumnType.STRING,
      editable: true,
      options: SIGNATORY_ACTIONS,
      width: '[20rem]',
    },
    {
      label: 'Remove',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: '[2rem]',
      actions: [
        {
          name: 'Remove Signatory',
          action: 'remove',
          icon: 'remove',
          color: Color.ERROR,
        },
      ],
    },
  ];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 100,
    length: 0,
  };

  searchUserControl = new FormControl();
  filteredUsers!: Observable<User[]>;

  destroyed$ = new Subject<void>();

  constructor(private userApi: UserApiService) {}

  ngOnInit(): void {
    this.page.length = this.signatories.length;

    this.filteredUsers = this.searchUserControl.valueChanges.pipe(
      startWith(''),
      takeUntil(this.destroyed$),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterUsers(val || '');
      })
    );
  }

  actionEventHandler(e: any) {
    const { action } = e.action;

    switch (action) {
      case 'remove':
        this._removeFromList(e.i);
        this._emitSignatories();
        break;

      default:
        break;
    }
  }

  updateSignatories(e: any) {
    deepInsert(e.newValue, e.column.dotNotationPath, e.element);
    this._copySignatoriesToSelf();
  }

  pushToList(user: User) {
    this.signatories.push({
      ...user,
      _userId: user._id,
      STATIC: {
        name: user.name,
        designation: user.designation,
      },
      action: SignatoryAction.APPROVED,
    });
    this._copySignatoriesToSelf();
    this.searchUserControl.reset();
  }

  private _copySignatoriesToSelf() {
    this.signatories.sort((a, b) => {
      var aIndex = SIGNATORY_ACTIONS.findIndex((action) => action === a.action);
      var bIndex = SIGNATORY_ACTIONS.findIndex((action) => action === b.action);
      return aIndex - bIndex;
    });
    this.signatories = [...this.signatories];
    this.page.length = -1;
    this._emitSignatories();
    setTimeout(() => {
      this.page.length = this.signatories.length;
    }, 20);
  }

  private _filterUsers(value: string) {
    return this.userApi
      .getUsers({ searchText: value, pageSize: 5 })
      .pipe(map((response: any) => response.records));
  }

  private _removeFromList(i: number) {
    this.signatories.splice(i, 1);
    this._copySignatoriesToSelf();
  }

  private _emitSignatories() {
    this.signatoriesEmitter.emit(this.signatories);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

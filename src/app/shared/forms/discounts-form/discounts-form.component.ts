import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Discount } from '@app/core/models/soa.model';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-discounts-form',
  styleUrl: './discounts-form.component.scss',
  templateUrl: './discounts-form.component.html',
})
export class DiscountsFormComponent implements OnInit, OnDestroy {
  @Input() discounts: Discount[] = [];
  @Output() discountsEmitter = new EventEmitter<Discount[]>();

  columns: TableColumn[] = [
    {
      label: 'Name',
      dotNotationPath: 'name',
      type: ColumnType.STRING,
    },
    {
      label: 'Value',
      dotNotationPath: 'value',
      type: ColumnType.NUMBER,
    },
    {
      label: 'Remove',
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: '[2rem]',
      actions: [
        {
          name: 'Remove Discount',
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

  discountForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    value: new FormControl(undefined, [Validators.required]),
  });

  filteredOptions!: Observable<Discount[]>;

  private destroyed$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.page.length = this.discounts.length;
  }

  actionEventHandler(e: any) {
    const { action } = e.action;

    switch (action) {
      case 'remove':
        this._removeFromList(e.i);
        this._emitDiscounts();
        break;

      default:
        break;
    }
  }

  pushToList() {
    this.discounts.push({
      ...(this.discountForm.getRawValue() as any),
    });
    this.discounts = [...this.discounts];
    this.page.length = this.discounts.length;
    this.discountForm.reset();
    this._emitDiscounts();
  }

  private _emitDiscounts() {
    this.discountsEmitter.emit(this.discounts);
  }

  private _removeFromList(i: number) {
    this.discounts.splice(i, 1);
    this.discounts = [...this.discounts];
    this.page.length--;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

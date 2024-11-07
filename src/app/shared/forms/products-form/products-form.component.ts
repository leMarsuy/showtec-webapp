import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Alignment } from '@app/core/enums/align.enum';
import { Color } from '@app/core/enums/color.enum';
import { ColumnType } from '@app/core/enums/column-type.enum';
import { TableColumn } from '@app/core/interfaces/table-column.interface';
import { Product } from '@app/core/models/product.model';
import { ProductApiService } from '@app/shared/services/api/product-api/product-api.service';
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

interface Pricing {
  STATIC: {
    unit_price: number;
    quantity: number;
    disc?: number;
    total: number;
  };
}

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
})
export class ProductsFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() products!: Array<Product & Pricing>;
  @Input({ alias: 'loading' }) isLoading = false;

  @Output() productsEmitter = new EventEmitter<Array<Product & Pricing>>();

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 100,
    length: 0,
  };

  columns: TableColumn[] = [
    {
      label: 'Item',
      dotNotationPath: ['brand', 'model'],
      type: ColumnType.STRING,
    },
    {
      label: 'Desc.',
      dotNotationPath: 'classification',
      type: ColumnType.STRING,
      editable: true,
      width: '[10rem]',
    },
    {
      label: 'Price',
      dotNotationPath: 'STATIC.unit_price',
      type: ColumnType.CURRENCY,
      editable: true,
      width: '[9rem]',
    },
    {
      label: 'Qty',
      dotNotationPath: 'STATIC.quantity',
      editable: true,
      type: ColumnType.NUMBER,
      width: '[7rem]',
    },
    {
      label: 'Disc.',
      dotNotationPath: 'STATIC.disc',
      editable: true,
      type: ColumnType.PERCENTAGE,
      width: '[7rem]',
    },
    {
      label: 'Total',
      dotNotationPath: 'STATIC.total',
      type: ColumnType.CURRENCY,
    },
    {
      label: '#',
      align: Alignment.CENTER,
      dotNotationPath: '_id',
      type: ColumnType.ACTION,
      width: 'fit',
      actions: [
        {
          name: 'Remove Product',
          action: 'remove',
          icon: 'remove',
          color: Color.ERROR,
        },
        // { icon: 'add', name: 'edit', color: Color.SUCCESS },
      ],
    },
  ];

  searchControl = new FormControl();
  filteredOptions!: Observable<Product[]>;

  private destroyed$ = new Subject<void>();

  constructor(private productApi: ProductApiService) {}

  ngOnInit(): void {
    this._initOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['products']?.isFirstChange()) {
      this.page.length = this.products.length;
    }
  }

  actionEventHandler(e: any) {
    const { action } = e.action;

    switch (action) {
      case 'remove':
        this._removeFromList(e.i);
        this._emitProducts();
        break;

      default:
        break;
    }
  }

  updateCellEventHandler(e: {
    newValue: any;
    column: TableColumn;
    element: Product & Pricing;
  }) {
    if (typeof e.column.dotNotationPath == 'string') {
      deepInsert(e.newValue, e.column.dotNotationPath, e.element);
    }

    var total = e.element.STATIC.quantity * e.element.STATIC.unit_price;
    e.element.STATIC.total = total - (e.element.STATIC.disc || 0) * total;
    this.products = [...this.products];
    this.page.length = -1;
    this._emitProducts();
    setTimeout(() => {
      this.page.length = this.products.length;
    }, 20);
  }

  pushToList(product: Product & Pricing) {
    const li = this.products;
    if (!li.find((o) => o._id === product._id)) {
      this.products.push({
        ...product,
        STATIC: {
          unit_price: product.price.amount,
          quantity: 1,
          disc: 0,
          total: product.price.amount - product.price.amount * 0,
        },
      });
    }
    this.products = [...this.products];
    this.page.length++;
    this.searchControl.reset();
    this._emitProducts();
  }

  private _removeFromList(i: number) {
    this.products.splice(i, 1);
    this.products = [...this.products];
    this.page.length--;
  }

  private _initOptions() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      takeUntil(this.destroyed$),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: any) => {
        return this._filterOptions(val || '');
      })
    );
  }

  private _filterOptions(value: string) {
    return this.productApi
      .getProducts({ searchText: value, pageSize: 30 })
      .pipe(map((response: any) => response.records));
  }

  private _emitProducts() {
    this.productsEmitter.emit(this.products);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

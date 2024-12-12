import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ClassificationOption,
  StockCheckerService,
} from '@app/modules/stock-checker/stock-checker.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import {
  debounceTime,
  Observable,
  of,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { ProductListService } from '../../product-list.service';

interface SortOption {
  label: string;
  tag?: string;
  sort: string;
}

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrl: './list-filter.component.scss',
})
export class ListFilterComponent implements OnInit, OnDestroy {
  private readonly snackbar = inject(SnackbarService);
  private readonly stockCheckerService = inject(StockCheckerService);
  private readonly productListService = inject(ProductListService);

  productClassifications!: ClassificationOption[];
  sortByCategories: SortOption[] = [
    {
      label: 'SKU Alphabetical',
      tag: 'A-Z',
      sort: 'sku',
    },
    {
      label: 'SKU Alphabetical',
      tag: 'Z-A',
      sort: '-sku',
    },
    {
      label: 'Price',
      tag: 'Lowest - Highest',
      sort: 'price.amount',
    },
    {
      label: 'Price',
      tag: 'Highest - Lowest',
      sort: '-price.amount',
    },
  ];

  searchCategory = new FormControl('');
  filteredCategories$!: Observable<ClassificationOption[]>;
  selectedCategories = [];

  selectedSortBy = new FormControl(this.sortByCategories[0]);

  private readonly destroyed$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.productClassifications =
        this.stockCheckerService.getClassifications();

      this.searchCategory.valueChanges
        .pipe(startWith(''), debounceTime(500), takeUntil(this.destroyed$))
        .subscribe((searchText) => {
          if (!searchText) {
            this.filteredCategories$ = of(this.productClassifications);
          } else {
            this.filteredCategories$ = this.filterCategory(searchText) as any;
          }
        });
    }, 100);
  }

  classificationSelect(item: ClassificationOption) {
    item.selected = !item.selected;
    this.requestProducts();
  }

  sortSelect() {
    this.requestProducts();
  }

  private filterCategory(searchText: string): Observable<string[]> {
    const filter = searchText.toLowerCase();
    const remapped: any = this.productClassifications.filter((item) =>
      item.classification.toLowerCase().includes(filter)
    );

    return of(remapped) as any;
  }

  private requestProducts() {
    const sortBy = this.selectedSortBy.value?.sort;
    const selectedClassifications =
      this.stockCheckerService.getSelectedClassifications();

    this.productListService.setProductlistFilters({
      sort: sortBy,
      classifications: selectedClassifications,
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ProductConfig } from '@app/modules/portal/pages/settings/pages/product-settings/product-settings.component';
import { ConfigApiService } from '@app/shared/services/api/config-api/config-api.service';
import { map } from 'rxjs';
import { StockCheckerOption } from '../select-input/select-input.component';

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrl: './list-filter.component.scss',
})
export class ListFilterComponent {
  private readonly configService = inject(ConfigApiService);
  private readonly productConfigName = 'product';

  productClassifications!: Array<string>;
  sortByCategories: StockCheckerOption[] = [
    {
      label: 'Alphabetical',
      tag: 'A-Z',
      value: 'alphabetical-asc',
    },
    {
      label: 'Alphabetical',
      tag: 'Z-A',
      value: 'alphabetical-desc',
    },
    {
      label: 'Price',
      tag: 'Lowest - Highest',
      value: 'price-asc',
    },
    {
      label: 'Price',
      tag: 'Highest - Lowest',
      value: 'price-desc',
    },
  ];

  selectedSortBy = this.sortByCategories[0];
  selectedCategories = [];

  constructor() {
    this.configService
      .getConfigByName(this.productConfigName)
      .pipe(
        map((response) => {
          const config = response as ProductConfig;
          return config.data.productClassifications;
        })
      )
      .subscribe({
        next: (classifications: Array<string>) => {
          this.productClassifications = classifications ?? [];
        },
        error: ({ error }: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  getTable() {}
}

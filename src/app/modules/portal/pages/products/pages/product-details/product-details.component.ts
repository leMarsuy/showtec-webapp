import { Component, OnInit } from '@angular/core';
import { ProductApiService } from '@shared/services/api/product-api/product-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Product } from '@core/models/product.model';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UpdateStockComponent } from './update-stock/update-stock.component';
import { Stock } from '@core/models/stock.model';
import { ColumnType } from '@core/enums/column-type.enum';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  searchForm = new FormGroup({
    searchText: new FormControl(''),
    stockStatus: new FormControl(''),
  });
  page: PageEvent = {
    pageIndex: 0,
    pageSize: 5,
    length: 1,
  };
  filteredStocks: Stock[] = [];
  total = 0;
  _id!: string;
  product!: Product;
  stockTypes = [
    { name: 'All', value: '' },
    { name: 'In Stock', value: 'In Stock' },
    { name: 'Out of Stock', value: 'Out of Stock' },
    { name: 'Reserved', value: 'Reserved' },
  ];
  constructor(
    private productApi: ProductApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {
    activatedRoute.params.pipe(map((p) => p['_id'])).subscribe((_id) => {
      this._id = _id;
      this.getProductById();
    });
  }

  columns: TableColumn[] = [
    // {
    //   label: 'Stock Age',
    //   dotNotationPath: 'ageInDays',
    //   type: ColumnType.AGE_IN_DAYS,
    // },
    {
      label: 'S/N',
      dotNotationPath: 'serialNumber',
      type: ColumnType.STRING,
    },
    {
      label: 'Cost',
      dotNotationPath: 'purchaseCost',
      type: ColumnType.CURRENCY,
    },
    {
      label: 'Status',
      dotNotationPath: 'status',
      type: ColumnType.STRING,
    },
  ];

  ngOnInit(): void {}

  getProductById() {
    this.productApi.getProductById(this._id).subscribe({
      next: (res) => {
        this.product = res as Product;
        this.product.stocks = this.product.stocks || [];
        this.page.length = this.product.stocks?.length;
        this.pageEvent(this.page);
      },
      error: (err) => {
        this.snackbarService.openErrorSnackbar(
          err.error.errorCode,
          err.error.message
        );
        setTimeout(() => {
          this.router.navigate(['/portal/products']);
        }, 3000);
      },
    });
  }

  pageEvent(e: PageEvent) {
    this.page.pageSize = e.pageSize;
    this.page.pageIndex = e.pageIndex;
    var skip = this.page.pageSize * this.page.pageIndex;
    this.filteredStocks = [...this.product.stocks.slice(skip)];
    console.log(this.filteredStocks);
  }

  openNewStock() {
    this.dialog
      .open(UpdateStockComponent, {
        width: '80rem',
        maxWidth: '80rem',
        disableClose: true,
        data: {
          _id: this.product._id,
          name: this.product.brand + ' ' + this.product.model,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getProductById();
      });
  }
}

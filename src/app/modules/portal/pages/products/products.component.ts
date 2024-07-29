import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from './add-product/add-product.component';
import { ContentHeaderAction } from '@core/interfaces/content-header-action.interface';
import { BatchAddProductComponent } from './batch-add-product/batch-add-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      icon: 'add',
      label: 'Add Product',
    },
  ];

  constructor(private dialog: MatDialog) {
    this.dialog
      .open(BatchAddProductComponent, {
        maxWidth: '60rem',
        width: '60rem',
      })
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          // trigger table refresh here
        }
      });
  }

  openAddProduct() {
    this.dialog
      .open(AddProductComponent, {
        maxWidth: '60rem',
        width: '60rem',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          // trigger table refresh here
        }
      });
  }

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.openAddProduct();
        break;

      default:
        break;
    }
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StockTransferDialogComponent } from '@app/shared/components/stock-transfer-dialog/stock-transfer-dialog.component';
import { ContentHeaderAction } from '@core/interfaces/content-header-action.interface';
import { AddProductComponent } from './add-product/add-product.component';
import { BatchAddProductComponent } from './batch-add-product/batch-add-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  actions: ContentHeaderAction[] = [
    {
      id: 'stock-transfer',
      icon: 'swap_horiz',
      label: 'Stock Transfer',
    },
    {
      id: 'batch',
      icon: 'post_add',
      label: 'Batch Insert',
    },
    {
      id: 'add',
      icon: 'add',
      label: 'Add Product',
    },
  ];

  constructor(private dialog: MatDialog) {}

  openBatchAdd() {
    this.dialog
      .open(BatchAddProductComponent, {
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

  openTransferStock() {
    this.dialog.open(StockTransferDialogComponent, {
      minWidth: '60vw',
      disableClose: true,
    });
  }

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.openAddProduct();
        break;

      case 'batch':
        this.openBatchAdd();
        break;

      case 'stock-transfer':
        this.openTransferStock();
        break;

      default:
        break;
    }
  }
}

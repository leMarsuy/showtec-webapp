import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';
import { WarehouseStockHistoryDialogComponent } from '@app/shared/components/warehouse-stock-history-dialog/warehouse-stock-history-dialog.component';

@Component({
  selector: 'app-warehousing',
  templateUrl: './warehousing.component.html',
  styleUrl: './warehousing.component.scss',
})
export class WarehousingComponent {
  private router = inject(Router);
  private readonly dialog = inject(MatDialog);

  actions: ContentHeaderAction[] = [
    {
      id: 'history',
      label: 'Transfer History',
      icon: 'history',
    },
  ];

  actionEvent(action: string) {
    switch (action) {
      case 'transfer':
        this.router.navigate(['portal/warehousing/transfer-stocks']);
        break;

      case 'history':
        this.dialog.open(WarehouseStockHistoryDialogComponent, {
          minWidth: '60vw',
          autoFocus: false,
        });
        break;

      default:
        break;
    }
  }
}

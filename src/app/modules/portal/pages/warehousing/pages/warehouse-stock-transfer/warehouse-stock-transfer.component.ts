import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse-stock-transfer',
  templateUrl: './warehouse-stock-transfer.component.html',
  styleUrl: './warehouse-stock-transfer.component.scss',
})
export class WarehouseStockTransferComponent {
  private router = inject(Router);

  navigateBack() {
    //#NOTE: Change it to constant path
    this.router.navigate(['portal/warehousing']);
  }
}

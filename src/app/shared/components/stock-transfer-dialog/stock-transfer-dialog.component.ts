import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StockTransferComponent } from '../stock-transfer/stock-transfer.component';

@Component({
  selector: 'app-stock-transfer-dialog',
  standalone: true,
  imports: [StockTransferComponent, MatDialogModule, MatIconModule],
  templateUrl: './stock-transfer-dialog.component.html',
  styleUrl: './stock-transfer-dialog.component.scss',
})
export class StockTransferDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<StockTransferDialogComponent>,
  );

  closeDialog() {
    this.dialogRef.close();
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { QrScannerDialogComponent } from './qr-scanner-dialog.component';

@NgModule({
  declarations: [QrScannerDialogComponent],
  exports: [QrScannerDialogComponent],
  imports: [
    CommonModule,
    NgxScannerQrcodeModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class QrScannerDialogModule {}

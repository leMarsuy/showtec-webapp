import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class QrScannerDialogModule {}

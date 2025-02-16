import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { LOAD_WASM, NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { QrScannerDialogComponent } from './qr-scanner-dialog.component';

LOAD_WASM('assets/wasm/ngx-scanner-qrcode.wasm').subscribe((res: any) => {
  console.log('LOAD_WASM', res);
});
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

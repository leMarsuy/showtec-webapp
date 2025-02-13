import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { QrScannerDialogModule } from './components/qr-scanner-dialog/qr-scanner-dialog.module';

@NgModule({
  declarations: [PortalComponent],
  imports: [
    CommonModule,
    PortalRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    QrScannerDialogModule,
    PdfJsViewerModule,
    AsyncPipe,
  ],
})
export class PortalModule {}

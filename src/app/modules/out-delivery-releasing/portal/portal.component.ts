import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import { filter, switchMap } from 'rxjs';
import { QrScannerDialogComponent } from './components/qr-scanner-dialog/qr-scanner-dialog.component';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent {
  private dialog = inject(MatDialog);
  private outDeliveryApi = inject(OutDeliveryApiService);
  private domSanitizer = inject(DomSanitizer);

  readonly logoSrc = 'images/logo.png';

  outDelivery!: OutDelivery;

  pdfData!: any;

  onLogout() {}

  onScannerOpen() {
    const scannerDialog = this.dialog.open(QrScannerDialogComponent, {
      panelClass: ['fullscreen-dialog', 'not-rounded-dialog'],
      autoFocus: false,
      disableClose: true,
    });

    scannerDialog
      .afterClosed()
      .pipe(
        filter((dialogResponse) => dialogResponse),
        switchMap((res: OutDelivery) => {
          this.outDelivery = res;
          return this.outDeliveryApi.getPdfOutDelivery(res._id ?? '');
        }),
      )
      .subscribe((response: { blob: Blob; filename: string }) => {
        this.pdfData = URL.createObjectURL(response.blob);
      });
  }
}

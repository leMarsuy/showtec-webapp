import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  pdfData!: SafeResourceUrl;

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
          return this.outDeliveryApi.getPdfOutDelivery(res._id ?? '');
        }),
      )
      .subscribe((response: { blob: Blob; filename: string }) => {
        const blob = new Blob([response.blob], { type: 'application/pdf' });

        const pdfLink = URL.createObjectURL(blob);

        window.open(pdfLink);

        setTimeout(() => {
          this.pdfData =
            this.domSanitizer.bypassSecurityTrustResourceUrl(pdfLink);
        }, 1000);
      });
  }

  private _createGoogleDocLink(pdfUrl: string) {
    return `https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`;
  }

  private _sanitizeBlobURL(url: string) {
    return url.replace(/^blob:/, '');
  }
}

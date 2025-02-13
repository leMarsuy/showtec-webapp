import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import {
  NgxScannerQrcodeComponent,
  ScannerQRCodeConfig,
  ScannerQRCodeDevice,
  ScannerQRCodeResult,
  ScannerQRCodeSymbolType,
} from 'ngx-scanner-qrcode';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-qr-scanner-dialog',
  templateUrl: './qr-scanner-dialog.component.html',
  styleUrl: './qr-scanner-dialog.component.scss',
})
export class QrScannerDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild(NgxScannerQrcodeComponent)
  scanner?: NgxScannerQrcodeComponent;

  private outDeliveryApi = inject(OutDeliveryApiService);
  private snackbar = inject(SnackbarService);
  private dialogRef = inject(MatDialogRef<QrScannerDialogComponent>);

  private destroyed$ = new Subject<void>();

  showError = false;
  errorMessage = 'Something went wrong.';

  devices: ScannerQRCodeDevice[] = [];
  selectedDevice: any = null;
  rearCameraRegex = /back|trás|rear|traseira|environment|ambiente/gi;

  scannerConfig: ScannerQRCodeConfig = {
    isMasked: false,
    symbolType: [ScannerQRCodeSymbolType.ScannerQRCode_QRCODE],
    constraints: {
      audio: false,
      video: {
        width: { exact: 640, ideal: 1920 },
        height: { ideal: 1080 },
        aspectRatio: { ideal: 1.7777777778 },
      },
    },
  };

  constructor() {}

  ngAfterViewInit(): void {
    this.scanner?.start();
    this.scanner?.devices
      .pipe(takeUntil(this.destroyed$))
      .subscribe((devices) => {
        if (!devices?.length) return;

        this.devices = devices;

        const device = devices.find((f) =>
          /back|rear|environment/gi.test(f.label),
        );

        this.scanner?.playDevice(
          device ? device.deviceId : devices[0].deviceId,
        );
      });
  }

  onChangeDevice(device: ScannerQRCodeDevice) {
    this.selectedDevice = device;
    this.scanner?.playDevice(device.deviceId);
  }

  onScanRead(output: ScannerQRCodeResult[]) {
    if (!output) return;

    this.scanner?.pause();
    const drCode = output[0].value;

    this.outDeliveryApi.getOutDeliveryByCode(drCode).subscribe({
      next: (outDelivery) => {
        this.dialogRef.close(outDelivery);
      },
      error: ({ error }: HttpErrorResponse) => {
        if (error.code !== 404) {
          console.log(error);
          this.snackbar.openErrorSnackbar(error.code, error.message);
        } else {
          this.showError = true;
          this.errorMessage = 'This delivery is not recognized by our system.';
        }
      },
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  closeError() {
    this.showError = false;
    this.scanner?.play();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.scanner?.stop();
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OutDeliveryReleasingService } from '@app/modules/out-delivery-releasing/out-delivery-releasing.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import {
  NgxScannerQrcodeComponent,
  ScannerQRCodeConfig,
  ScannerQRCodeDevice,
  ScannerQRCodeResult,
  ScannerQRCodeSymbolType,
} from 'ngx-scanner-qrcode';
import { filter, Subject } from 'rxjs';

@Component({
  selector: 'app-qr-scanner-dialog',
  templateUrl: './qr-scanner-dialog.component.html',
  styleUrl: './qr-scanner-dialog.component.scss',
})
export class QrScannerDialogComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild(NgxScannerQrcodeComponent)
  scanner!: NgxScannerQrcodeComponent;

  private outDeliveryApi = inject(OutDeliveryApiService);
  private snackbar = inject(SnackbarService);
  private outDeliveryReleasingService = inject(OutDeliveryReleasingService);
  private dialogRef = inject(MatDialogRef<QrScannerDialogComponent>);

  private destroyed$ = new Subject<void>();

  showError = false;
  errorTitle = 'This QR is not recognized by our system.';
  errorMessage =
    'Please make sure that the QR you are scanning is for Delivery';

  devices: ScannerQRCodeDevice[] = [];
  rearCameraRegex = new RegExp(
    'back|trás|rear|traseira|environment|ambiente',
    'gi',
  );

  useCamera!: ScannerQRCodeDevice;

  scannerConfig: ScannerQRCodeConfig = {
    isMasked: false,
    symbolType: [ScannerQRCodeSymbolType.ScannerQRCode_QRCODE],
    constraints: {
      audio: false,
      video: {
        width: { exact: 640, ideal: 1920 },
        height: { ideal: 1080 },
        aspectRatio: { ideal: 0.5625 },
      },
    },
  };

  constructor() {}

  ngOnInit(): void {
    this.outDeliveryReleasingService.closeScanner$
      .pipe(filter((shouldClose) => shouldClose))
      .subscribe(() => {
        this.scanner?.stop();
      });
  }

  ngAfterViewInit(): void {
    this.scanner.isReady.pipe(filter((ready) => ready)).subscribe(() => {
      const playDeviceFacingBack = (devices: any[]) => {
        let useCameraId;

        const cameraDeviceIdFromStorage =
          localStorage.getItem('cameraDeviceId');

        if (!cameraDeviceIdFromStorage) {
          const findRearCamera = devices.find((device) =>
            this.rearCameraRegex.test(device.label),
          );

          this.useCamera = findRearCamera ? findRearCamera : devices[0];

          useCameraId = this.useCamera.deviceId;
          localStorage.setItem('cameraDeviceId', useCameraId);
        } else {
          useCameraId = cameraDeviceIdFromStorage;
        }

        this.scanner.playDevice(useCameraId);
      };

      this.scanner.start(playDeviceFacingBack).subscribe();
    });
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
          console.error(error);
          this.snackbar.openErrorSnackbar(error.code, error.message);
        } else {
          this.showError = true;
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
    // this.scanner?.stop();
  }
}

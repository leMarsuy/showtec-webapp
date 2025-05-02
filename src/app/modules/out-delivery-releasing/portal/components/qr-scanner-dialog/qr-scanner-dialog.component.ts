import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import {
  NgxScannerQrcodeComponent,
  ScannerQRCodeConfig,
  ScannerQRCodeDevice,
  ScannerQRCodeResult,
  ScannerQRCodeSymbolType,
} from 'ngx-scanner-qrcode';
import { filter } from 'rxjs';

@Component({
  selector: 'app-qr-scanner-dialog',
  templateUrl: './qr-scanner-dialog.component.html',
  styleUrl: './qr-scanner-dialog.component.scss',
})
export class QrScannerDialogComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  private outDeliveryApi = inject(OutDeliveryApiService);
  private snackbar = inject(SnackbarService);
  // private dialogRef = inject(MatDialogRef<QrScannerDialogComponent>);

  @Output() qrCodeScanned = new EventEmitter<any>();
  @ViewChild(NgxScannerQrcodeComponent)
  scanner!: NgxScannerQrcodeComponent;

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
  };

  constructor() {}

  ngOnInit(): void {}

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
        this.qrCodeScanned.emit(outDelivery);
        // this.dialogRef.close(outDelivery);
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
    window.location.href = window.location.pathname;
    // this.dialogRef.close(false);
  }

  closeError() {
    this.showError = false;
    this.scanner?.play();
  }

  ngOnDestroy(): void {
    this.scanner?.stop();
    console.log('Scanner stopped');
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PORTAL_PATHS, RELEASING_PATHS } from '@app/core/constants/nav-paths';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import { BehaviorSubject, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent {
  private dialog = inject(MatDialog);
  private outDeliveryApi = inject(OutDeliveryApiService);
  private authServiceApi = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private confirmation = inject(ConfirmationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  readonly logoSrc = 'images/logo.png';

  readonly pendingStatus = OutDeliveryStatus.PENDING;

  loading$ = new BehaviorSubject<boolean>(false);

  showInfo = false;
  infoMessage = '';

  outDelivery: OutDelivery | null = null;
  pdfData!: any;

  tabIndex = 0;

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['tab'] === '1') {
        this.tabIndex = 1;
      } else {
        this.tabIndex = 0;
      }
    });
  }

  onLogout() {
    this.authServiceApi.logout().subscribe({
      error: ({ error }: HttpErrorResponse) => {
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
      },
      complete: () => {
        this.snackbar.openSuccessSnackbar('Logged Out', 'You have logged out');
        this.router.navigate([RELEASING_PATHS.auth.relativeUrl]);
      },
    });
  }

  onNavigatePortal() {
    this.snackbar.openLoadingSnackbar(
      'Redirecting to Portal',
      'Please wait...',
    );
    this.router.navigate(['/' + PORTAL_PATHS.baseUrl]);
  }

  onScannerOpen() {
    this.tabIndex = 1;
    // const scannerDialog = this.dialog.open(QrScannerDialogComponent, {
    //   panelClass: ['fullscreen-dialog', 'not-rounded-dialog'],
    //   autoFocus: false,
    //   disableClose: true,
    // });

    // scannerDialog
    //   .afterClosed()
    //   .pipe(
    //     filter((dialogResponse) => dialogResponse),
    //     switchMap((outDelivery: OutDelivery) => {
    //       this.outDelivery = outDelivery;
    //       this._showSnackbarInfoByOutDeliveryStatus(outDelivery);

    //       return this.outDeliveryApi.getPdfOutDelivery(outDelivery._id ?? '');
    //     }),
    //   )
    //   .subscribe((response: { blob: Blob; filename: string }) => {
    //     this.pdfData = URL.createObjectURL(response.blob);
    //   });
  }

  qrCodeScanned(outDelivery: OutDelivery) {
    this.outDelivery = outDelivery;
    this._showSnackbarInfoByOutDeliveryStatus(outDelivery);

    this.outDeliveryApi.getPdfOutDelivery(outDelivery._id ?? '').subscribe({
      next: (response: { blob: Blob; filename: string }) => {
        this.pdfData = URL.createObjectURL(response.blob);
        this.tabIndex = 0;
      },
    });
  }

  onNewQRScan() {
    window.location.href = window.location.pathname + '?tab=1';
  }

  onReleaseOutDelivery() {
    this.confirmation
      .open('Mark Delivery as Release', 'Do you want to release this delivery?')
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => {
          this._setLoadingState(true);
          this.snackbar.openLoadingSnackbar(
            'Releasing Delivery',
            'Please Wait...',
          );
          return this.outDeliveryApi.releaseOutDeliveryById(
            this.outDelivery?._id as string,
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.snackbar.closeLoadingSnackbar();
          this._setLoadingState(false);

          setTimeout(() => {
            this.snackbar.openSuccessSnackbar(
              'Success!',
              'Delivery has been marked as Released!',
            );

            this.outDelivery = null;
            this.pdfData = null;
          }, 200);
        },
        error: ({ error }) => {
          this._setLoadingState(false);
          this.snackbar.closeLoadingSnackbar();
          this.snackbar.openErrorSnackbar(error.code, error.message, {
            duration: 9000,
          });
        },
      });
  }

  private _showSnackbarInfoByOutDeliveryStatus(outDelivery: OutDelivery) {
    if (outDelivery.status === OutDeliveryStatus.PENDING) return;

    let infoMessage =
      'This delivery is not pending for delivery. Please contact the person in-charge';

    switch (outDelivery.status) {
      case OutDeliveryStatus.RELEASED:
        infoMessage = 'This delivery is already marked as released.';
        break;
      case OutDeliveryStatus.CANCELLED:
        infoMessage =
          'This delivery is canceled and not permitted to be released.';
        break;
      case OutDeliveryStatus.DELIVERED:
        infoMessage =
          'This delivery is marked as delivered in our system. Please contact the person in-charge';
        break;
      default:
        break;
    }

    this.infoMessage = infoMessage;
    this.showInfo = true;
  }

  private _setLoadingState(isLoading: boolean) {
    this.loading$.next(isLoading);
  }
}

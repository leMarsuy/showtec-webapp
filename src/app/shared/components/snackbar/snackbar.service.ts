import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { LoadingComponent } from './loading/loading.component';
import { ErrorComponent } from './error/error.component';
import { SuccessComponent } from './success/success.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  _loadingSnackbarRef!: MatSnackBarRef<LoadingComponent>;

  constructor(private snackbar: MatSnackBar) {}

  openLoadingSnackbar(title: string, message: string) {
    this._loadingSnackbarRef = this.snackbar.openFromComponent(
      LoadingComponent,
      {
        panelClass: ['showtec-snackbar'],
        data: {
          title,
          message,
        },
      }
    );
  }

  openErrorSnackbar(title: string, message?: string) {
    this._loadingSnackbarRef = this.snackbar.openFromComponent(ErrorComponent, {
      panelClass: ['showtec-snackbar'],
      data: {
        title,
        message:
          message || 'Something went wrong while connecting to our server.',
      },
    });
  }

  openSuccessSnackbar(title: string, message?: string) {
    this._loadingSnackbarRef = this.snackbar.openFromComponent(
      SuccessComponent,
      {
        panelClass: ['showtec-snackbar'],
        duration: 3000,
        data: {
          title,
          message: message,
        },
      }
    );
  }

  closeLoadingSnackbar(): Promise<Boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._loadingSnackbarRef.dismiss();
        resolve(true);
      }, 1300);
    });
  }
}

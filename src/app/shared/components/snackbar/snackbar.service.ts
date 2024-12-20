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
        data: {
          title,
          message,
        },
      },
    );
  }

  openErrorSnackbar(title: string, message?: string) {
    return this.snackbar.openFromComponent(ErrorComponent, {
      data: {
        title,
        duration: 1500,
        message:
          message || 'Something went wrong while connecting to our server.',
      },
    });
  }

  openSuccessSnackbar(title: string, message?: string) {
    return this.snackbar.openFromComponent(SuccessComponent, {
      duration: 3000,
      data: {
        title,
        message: message,
      },
    });
  }

  closeLoadingSnackbar(): Promise<Boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._loadingSnackbarRef.dismiss();
        resolve(true);
      }, 500);
    });
  }
}

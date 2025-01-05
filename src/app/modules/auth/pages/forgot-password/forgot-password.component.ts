import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_PATHS } from '@app/core/constants/nav-paths';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  loading = false;
  constructor(
    private router: Router,
    private authApi: AuthService,
    private snackbar: SnackbarService,
  ) {}

  onLoginNavigate() {
    this.router.navigate([AUTH_PATHS.login.relativeUrl]);
  }

  onSubmit() {
    this.loading = true;
    this.emailControl.disable();

    const email = this.emailControl.getRawValue() as string;
    this.authApi.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([AUTH_PATHS.login.relativeUrl]);

        this.snackbar.openSuccessSnackbar(
          'Email Sent!',
          'Please check your inbox',
        );
      },
      error: ({ error }: HttpErrorResponse) => {
        console.error(error);
        this.snackbar.openErrorSnackbar(error.errorCode, error.message);
      },
    });
  }
}

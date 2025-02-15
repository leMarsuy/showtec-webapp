import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RELEASING_PATHS } from '@app/core/constants/nav-paths';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss',
})
export class AuthLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);

  readonly logoDesc = 'SHOWTEC AUDIO AND LIGHTS SOLUTION CO.';
  readonly logoSrc = 'images/logo.png';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.loginForm.disable();
    this.snackbar.openLoadingSnackbar(
      'Login',
      'Validating your credentials...',
    );

    const { email, password } = this.loginForm.getRawValue();
    this.authService.loginReleasing(email ?? '', password ?? '').subscribe({
      next: () => {
        this.snackbar.closeLoadingSnackbar().then(() => {
          this.router.navigate([RELEASING_PATHS.portal.relativeUrl]);
          this.loginForm.enable();
          this.snackbar.openSuccessSnackbar(
            'AuthSuccess',
            'Redirecting to your dashboard...',
          );
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loginForm.enable();
        this.snackbar.closeLoadingSnackbar().then(() => {
          this.snackbar.openErrorSnackbar(
            err.error.errorCode,
            err.error.message,
          );
        });
      },
    });
  }
}

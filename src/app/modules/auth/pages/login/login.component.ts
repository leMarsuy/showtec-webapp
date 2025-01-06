import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_PATHS, PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { NavIcon } from '@app/core/enums/nav-icons.enum';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { AuthService } from '@shared/services/api';

@Component({
  selector: 'app-login',

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  showPassword = false;

  readonly stockCheckerIcon = NavIcon.STOCK_CHECKER;
  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  // show or hide password
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPasswordNavigate() {
    this.router.navigate([AUTH_PATHS.forgotPassword.relativeUrl]);
  }

  login() {
    this.loginForm.disable();
    this.snackbarService.openLoadingSnackbar(
      'Login',
      'Validating your credentials...',
    );
    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email ?? '', password ?? '').subscribe({
      next: () => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this.router.navigate([PORTAL_PATHS.baseUrl]);
          this.loginForm.enable();
          this.snackbarService.openSuccessSnackbar(
            'AuthSuccess',
            'Redirecting to your dashboard...',
          );
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loginForm.enable();
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this.snackbarService.openErrorSnackbar(
            err.error.errorCode,
            err.error.message,
          );
        });
      },
    });
  }
}

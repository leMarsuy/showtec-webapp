import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { NavIcon } from '@app/core/enums/nav-icons.enum';

@Component({
  selector: 'app-login',

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('it@showtec.ph', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('Password123!', [Validators.required]),
  });
  showPassword = false;

  readonly stockCheckerIcon = NavIcon.STOCK_CHECKER;
  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // show or hide password
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPasswordNavigate() {
    this.router.navigate(['auth', 'forgot-password']);
  }

  login() {
    this.loginForm.disable();
    this.snackbarService.openLoadingSnackbar(
      'Login',
      'Validating your credentials...'
    );
    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email || '', password || '').subscribe({
      next: () => {
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this.snackbarService.openSuccessSnackbar(
            'AuthSuccess',
            'Redirecting to your dashboard...'
          );
          this.router.navigate(['portal']);
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackbarService.closeLoadingSnackbar().then(() => {
          this.loginForm.enable();
          this.snackbarService.openErrorSnackbar(
            err.error.errorCode,
            err.error.message
          );
        });
      },
    });
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_PATHS, PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { User } from '@core/models/user.model';
import { AuthService } from '@shared/services/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  appName = 'Inventory Management System';
  logoSrc = 'images/logo.png';
  me!: User;

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.me().subscribe((res) => {
      this.me = res;
      // console.log(this.me);
    });
  }

  onAccountSettings() {
    this.router.navigate([PORTAL_PATHS.settings.account.relativeUrl]);
  }

  onLogout() {
    this.authService.logout().subscribe({
      error: ({ error }: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
      complete: () => {
        this.snackbarService.openSuccessSnackbar(
          'Logged Out',
          'You have logged out',
        );
        this.router.navigate([AUTH_PATHS.login.relativeUrl]);
      },
    });
  }
}

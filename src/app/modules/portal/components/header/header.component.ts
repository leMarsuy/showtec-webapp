import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/api';
import { User } from '@core/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.me().subscribe((res) => {
      this.me = res;
      // console.log(this.me);
    });
  }

  onAccountSettings() {
    this.router.navigate(['portal', 'settings', 'account']);
  }

  onLogout() {
    this.authService.logout().subscribe({
      error: ({ error }: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar(error.errorCode, error.message);
      },
      complete: () => {
        this.snackbarService.openSuccessSnackbar(
          'Logged Out',
          'You have logged out'
        );
        this.router.navigate(['/auth/login']);
      },
    });
  }
}

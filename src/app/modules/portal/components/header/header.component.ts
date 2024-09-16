import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/api';
import { User } from '@core/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

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
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.me().subscribe((res) => {
      this.me = res;
      console.log(this.me);
    });
  }

  onAccountSettings() {
    // const dialogRef = this.dialog.open(AccountSettingsComponent, {
    //   data: {
    //     user: this.me,
    //   },
    //   height: '56%',
    //   width: 'calc(100% - 144px)',
    //   maxWidth: '100%',
    //   disableClose: true,
    //   autoFocus: false,
    // });
    // dialogRef.afterClosed().subscribe(() => {
    //   //do something
    // });
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

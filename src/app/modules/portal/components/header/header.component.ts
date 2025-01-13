import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_PATHS, PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { selectUser } from '@app/core/states/user';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { User } from '@core/models/user.model';
import { Store } from '@ngrx/store';
import { AuthService } from '@shared/services/api';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  appName = 'Inventory Management System';
  logoSrc = 'images/logo.png';
  me!: User;

  private storeMe$: Observable<any> = new Observable<any>();
  private destroyed$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.storeMe$ = this.store.select(selectUser());
    this.storeMe$.pipe(takeUntil(this.destroyed$)).subscribe((user) => {
      this.me = user;
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

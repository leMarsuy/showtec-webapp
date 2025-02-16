import { Component, inject, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RELEASING_PATHS } from '@app/core/constants/nav-paths';
import { UserType } from '@app/core/enums/user-type.enum';
import { NavRoute } from '@app/core/lists/nav-routes.list';
import { selectPortalNavigations } from '@app/core/states/portal-navigations';
import { selectUser } from '@app/core/states/user';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { combineLatest, Subject, take } from 'rxjs';
import { PortalService } from '../../portal.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly portalService = inject(PortalService);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);

  navList!: any;
  @Input() expanded!: Boolean;

  // check development mode
  isDeveloperMode = environment.ENVIRONMENT_NAME === 'development';

  private _destroyed$ = new Subject<void>();

  constructor() {
    combineLatest({
      user: this.store.select(selectUser()),
      adminNavigation: this.store.select(selectPortalNavigations()),
      userNavigation: this.portalService.portalNavigation$,
    })
      .pipe(take(1))
      .subscribe((response) => {
        if (response.user.userType === UserType.ADMIN) {
          this.navList = response.adminNavigation;
          return;
        }

        if (response.user.permissions) {
          this.navList = response.userNavigation;
        }
      });
  }

  initiateLoading(item: NavRoute) {
    const releasingUrl = `/${[RELEASING_PATHS.baseUrl]}`;
    if (releasingUrl === item.path) {
      this.snackbar.openLoadingSnackbar(
        'Redirecting to Releasing',
        'Please wait...',
      );
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

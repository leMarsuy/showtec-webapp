import { Component, inject, Input, OnDestroy } from '@angular/core';
import { UserType } from '@app/core/enums/user-type.enum';
import { selectPortalNavigations } from '@app/core/states/portal-navigations';
import { selectUser } from '@app/core/states/user';
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

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

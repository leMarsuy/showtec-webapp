import { Component, Input } from '@angular/core';
import { NAV_ROUTES } from '@app/core/lists/nav-routes.list';
import { enviroment } from '@env/environment';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  navList = NAV_ROUTES;
  @Input() expanded!: Boolean;

  // check development mode
  isDeveloperMode = enviroment.ENVIRONMENT_NAME === 'development';
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { PortalService } from './portal.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent {
  expanded = false;
  isDeveloperMode = environment.ENVIRONMENT_NAME === 'development';

  constructor(
    private activatedRoute: ActivatedRoute,
    private portalService: PortalService,
  ) {
    const config = this.activatedRoute.snapshot.data['config'];
    this.portalService.setPortalNavigation(config.data.navigations);
  }
}

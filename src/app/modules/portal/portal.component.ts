import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent {
  expanded = false;
  isDeveloperMode = environment.ENVIRONMENT_NAME === 'development';
}

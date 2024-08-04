import { Component } from '@angular/core';
import { enviroment } from '@env/environment';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent {
  expanded = false;
  isDeveloperMode = enviroment.ENVIRONMENT_NAME === 'development';
}

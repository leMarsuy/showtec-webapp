import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';

@Component({
  selector: 'app-soa',
  templateUrl: './soa.component.html',
  styleUrl: './soa.component.scss',
})
export class SoaComponent {
  //
  constructor(private router: Router) {}

  // content header

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Create Statement of Account',
      icon: 'add',
    },
  ];

  actionEvent(action: string) {
    switch (action) {
      case 'add':
        this.router.navigate([PORTAL_PATHS.soas.createUrl]);
        break;

      default:
        break;
    }
  }
}

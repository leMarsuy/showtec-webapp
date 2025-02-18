import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';

@Component({
  selector: 'app-warehousing',
  templateUrl: './warehousing.component.html',
  styleUrl: './warehousing.component.scss',
})
export class WarehousingComponent {
  private router = inject(Router);

  actions: ContentHeaderAction[] = [
    {
      id: 'transfer',
      label: 'Transfer Stocks',
      icon: 'sync_alt',
    },
  ];

  actionEvent(action: string) {
    switch (action) {
      case 'transfer':
        //#NOTE: Change this to constant path
        this.router.navigate(['portal/warehousing/transfer-stocks']);
        break;

      default:
        break;
    }
  }
}

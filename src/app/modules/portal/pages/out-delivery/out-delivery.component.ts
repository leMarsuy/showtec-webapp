import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';

@Component({
  selector: 'app-out-delivery',
  templateUrl: './out-delivery.component.html',
  styleUrl: './out-delivery.component.scss',
})
export class OutDeliveryComponent {
  //
  constructor(private router: Router) {}

  // content header

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Create Delivery Receipt',
      icon: 'add',
    },
  ];

  actionEvent(action: string) {
    console.log(action);
    switch (action) {
      case 'add':
        this.router.navigate(['/portal/out-delivery/create']);
        break;

      default:
        break;
    }
  }
}

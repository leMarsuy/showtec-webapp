import { Component } from '@angular/core';
import { ContentHeaderAction } from '@app/core/interfaces/content-header-action.interface';

@Component({
  selector: 'app-out-delivery',
  templateUrl: './out-delivery.component.html',
  styleUrl: './out-delivery.component.scss',
})
export class OutDeliveryComponent {
  // content header

  actions: ContentHeaderAction[] = [
    {
      id: 'add',
      label: 'Create Delivery Receipt',
      icon: 'add',
    },
  ];

  // table module

  actionEvent(action: string) {}
}

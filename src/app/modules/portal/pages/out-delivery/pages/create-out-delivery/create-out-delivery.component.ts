import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';

@Component({
  selector: 'app-create-out-delivery',
  providers: [],
  templateUrl: './create-out-delivery.component.html',
  styleUrl: './create-out-delivery.component.scss',
})
export class CreateOutDeliveryComponent {
  private router = inject(Router);

  navigateBack() {
    this.router.navigate([PORTAL_PATHS.deliveryReceipts.relativeUrl]);
  }
}

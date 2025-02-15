import { Component, inject, OnDestroy } from '@angular/core';
import { OutDeliveryReleasingService } from './out-delivery-releasing.service';

@Component({
  selector: 'app-out-delivery-releasing',
  templateUrl: './out-delivery-releasing.component.html',
  styleUrl: './out-delivery-releasing.component.scss',
})
export class OutDeliveryReleasingComponent implements OnDestroy {
  private outDeliveryReleasingService = inject(OutDeliveryReleasingService);

  ngOnDestroy(): void {
    this.outDeliveryReleasingService.closeScanner$.next(true);
  }
}

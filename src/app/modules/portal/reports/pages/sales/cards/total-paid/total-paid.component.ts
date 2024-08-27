import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-total-paid',
  templateUrl: './total-paid.component.html',
  styleUrl: './total-paid.component.scss',
})
export class TotalPaidComponent {
  @Input() data: any;
}

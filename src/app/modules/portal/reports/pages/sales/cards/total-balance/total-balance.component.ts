import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-total-balance',
  templateUrl: './total-balance.component.html',
  styleUrl: './total-balance.component.scss',
})
export class TotalBalanceComponent {
  @Input() data: any;
}

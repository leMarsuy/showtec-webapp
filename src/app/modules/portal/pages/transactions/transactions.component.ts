import { Component } from '@angular/core';
import { NavIcon } from '@app/core/enums/nav-icons.enum';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  readonly transactionsIcon = NavIcon.TRANSACTIONS;
  readonly label = 'TRANSACTIONS';
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stock-drop-list',
  templateUrl: './stock-drop-list.component.html',
  styleUrl: './stock-drop-list.component.scss',
})
export class StockDropListComponent {
  @Input() warehouses: any = [];
}

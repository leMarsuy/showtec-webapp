import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-products-sold',
  templateUrl: './products-sold.component.html',
  styleUrl: './products-sold.component.scss',
})
export class ProductsSoldComponent {
  @Input() data: any;
}

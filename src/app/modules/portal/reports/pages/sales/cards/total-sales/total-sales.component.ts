import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrl: './total-sales.component.scss',
})
export class TotalSalesComponent implements OnInit {
  @Input() value: number = 0;
  @Input() increase: number = 0;
  increaseInPercent = 0;

  ngOnInit(): void {
    this.increaseInPercent = this.increase / this.value;
  }
}

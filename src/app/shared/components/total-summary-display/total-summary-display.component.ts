import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Discount, Tax } from '@app/core/models/soa.model';

@Component({
  selector: 'app-total-summary-display',
  templateUrl: './total-summary-display.component.html',
  styleUrl: './total-summary-display.component.scss',
})
export class TotalSummaryDisplayComponent implements OnInit {
  @Input({ alias: 'summary' }) fGroup!: FormGroup;
  @Input() discounts: Discount[] = [];
  @Input() taxes: Tax[] = [];

  ngOnInit(): void {}
}

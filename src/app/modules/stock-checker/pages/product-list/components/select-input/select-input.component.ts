import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface StockCheckerOption {
  label: string;
  tag?: string;
  value: string;
}

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
})
export class SelectInputComponent {
  @Input() options!: Array<StockCheckerOption>;
}

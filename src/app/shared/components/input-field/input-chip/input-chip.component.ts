import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-chip',
  templateUrl: './input-chip.component.html',
  styleUrl: './input-chip.component.scss',
})
export class InputChipComponent {
  @Input() chipFormArray!: FormArray;
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() class: string = '';

  chips: string[] = [];
  inputControl = new FormControl('');
  constructor() {}

  push() {
    if (this.inputControl.value) {
      this.chips.push(this.inputControl.value);
      this.chipFormArray.push(new FormControl(this.inputControl.value));
    }
    this.inputControl.reset();
  }

  remove(i: number) {
    this.chips.splice(i, 1);
    this.chipFormArray.removeAt(i);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputChipComponent } from './input-chip.component';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InputChipComponent],
  imports: [CommonModule, MatChipsModule, FormsModule, ReactiveFormsModule],
  exports: [InputChipComponent],
})
export class InputChipModule {}

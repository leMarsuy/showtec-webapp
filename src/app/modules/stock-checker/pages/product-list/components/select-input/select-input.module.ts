import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectInputComponent } from './select-input.component';
import { CdkMenuModule } from '@angular/cdk/menu';

@NgModule({
  declarations: [SelectInputComponent],
  exports: [SelectInputComponent],
  imports: [CommonModule, CdkMenuModule],
})
export class SelectInputModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from './content-header.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ContentHeaderComponent],
  imports: [CommonModule, MatIconModule],
  exports: [ContentHeaderComponent],
})
export class ContentHeaderModule {}

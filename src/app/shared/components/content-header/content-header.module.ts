import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from './content-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ContentHeaderComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [ContentHeaderComponent],
})
export class ContentHeaderModule {}

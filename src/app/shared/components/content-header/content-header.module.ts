import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContentHeaderComponent } from './content-header.component';

@NgModule({
  declarations: [ContentHeaderComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  exports: [ContentHeaderComponent],
})
export class ContentHeaderModule {}

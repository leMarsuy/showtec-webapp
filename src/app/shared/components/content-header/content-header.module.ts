import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContentHeaderComponent } from './content-header.component';

@NgModule({
  declarations: [ContentHeaderComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, CdkMenuModule],
  exports: [ContentHeaderComponent],
})
export class ContentHeaderModule {}

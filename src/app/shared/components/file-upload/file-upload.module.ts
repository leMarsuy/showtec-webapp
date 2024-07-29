import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from './file-upload.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationComponent } from './confirmation.component';

@NgModule({
  declarations: [ConfirmationComponent],
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
})
export class ConfirmationModule {}

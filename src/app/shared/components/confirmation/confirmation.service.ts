import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(private dialog: MatDialog) {}

  open(title: string, message: string) {
    return this.dialog.open(ConfirmationComponent, {
      width: '50rem',
      maxWidth: '50rem',
      data: {
        title,
        message,
      },
    });
  }
}

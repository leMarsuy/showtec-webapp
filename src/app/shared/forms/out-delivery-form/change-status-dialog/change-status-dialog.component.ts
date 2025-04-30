import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-status-dialog',
  templateUrl: './change-status-dialog.component.html',
  styleUrl: './change-status-dialog.component.scss',
})
export class ChangeStatusDialogComponent {
  statusChangeReason = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<ChangeStatusDialogComponent>,
  ) {}

  onDialogClose(isConfirm = false) {
    this._dialogRef.close({ isConfirm, remarks: this.statusChangeReason });
  }
}

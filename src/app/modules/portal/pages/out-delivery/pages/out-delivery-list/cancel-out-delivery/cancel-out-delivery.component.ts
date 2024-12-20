import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';

@Component({
  selector: 'app-cancel-out-delivery',
  templateUrl: './cancel-out-delivery.component.html',
  styleUrl: './cancel-out-delivery.component.scss',
})
export class CancelOutDeliveryComponent {
  tableColumns = [
    {
      label: 'Brand',
      dotNotation: 'STATIC.brand',
    },
    {
      label: 'Classification',
      dotNotation: 'STATIC.classification',
    },
    {
      label: 'Model',
      dotNotation: 'STATIC.model',
    },
    {
      label: 'Serial No.',
      dotNotation: 'STATIC.serialNumber',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<CancelOutDeliveryComponent>,
  ) {}

  onDialogClose(isConfirm = false) {
    this._dialogRef.close(isConfirm);
  }
}

import { Component, Inject, inject } from '@angular/core';
import { SnackbarData } from '@core/interfaces/snackbar.interface';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Color } from '@app/core/enums/color.enum';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent {
  color = Color.ERROR;
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData) {}
}

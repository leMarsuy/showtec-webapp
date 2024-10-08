import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Color } from '@app/core/enums/color.enum';
import { SnackbarData } from '@core/interfaces/snackbar.interface';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  color = Color.INFO;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData) {}
}

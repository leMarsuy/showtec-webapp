import { Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Color } from '@app/core/enums/color.enum';
import { SnackbarData } from '@app/core/interfaces/snackbar.interface';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent {
  readonly color = Color.INFO;
  readonly snackBarRef = inject(MatSnackBarRef);
  readonly data: SnackbarData = inject<SnackbarData>(MAT_SNACK_BAR_DATA);
}

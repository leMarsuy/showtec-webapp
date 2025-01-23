import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingComponent } from './loading/loading.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ErrorComponent } from './error/error.component';
import { SuccessComponent } from './success/success.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [LoadingComponent, ErrorComponent, SuccessComponent, InfoComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
})
export class SnackbarModule {}

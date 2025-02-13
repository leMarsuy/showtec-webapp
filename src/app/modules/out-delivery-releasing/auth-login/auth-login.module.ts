import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SnackbarModule } from '@app/shared/components/snackbar/snackbar.module';
import { AuthLoginRoutingModule } from './auth-login-routing.module';
import { AuthLoginComponent } from './auth-login.component';

@NgModule({
  declarations: [AuthLoginComponent],
  imports: [
    CommonModule,
    AuthLoginRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    SnackbarModule,
  ],
})
export class AuthLoginModule {}

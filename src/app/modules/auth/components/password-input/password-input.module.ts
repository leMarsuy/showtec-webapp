import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordInputComponent } from './password-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PasswordInputComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatIconModule,
    ReactiveFormsModule,
  ],
  exports: [PasswordInputComponent],
})
export class PasswordInputModule {}

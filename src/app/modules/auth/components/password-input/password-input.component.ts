import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
})
export class PasswordInputComponent {
  @Input({ required: true }) fc!: FormControl;
  @Input() label!: string;
  @Output() enterPressed: EventEmitter<void> = new EventEmitter<void>();

  isPasswordVisible = false;
}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegexValidator } from '@app/core/enums/regex-validators.enum';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { AuthService } from '@app/shared/services/api';
import { regexValidator } from '@app/shared/validators/regex.validator';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetFieldsConfig = {
    password: {
      label: 'New Password',
      name: 'password',
      removeHint: true,
    },
    confirmPassword: {
      type: 'password',
      label: 'Confirm Password',
      name: 'confirmPassword',
    },
  };

  validations = [
    {
      type: 'one-number',
      regex: RegexValidator.ATLEAST_ONE_NUMBER,
    },
    {
      type: 'one-special-character',
      regex: RegexValidator.ATLEAST_ONE_SPECIAL_CHARACTER,
    },
    {
      type: 'one-upper-lower-case',
      regex: RegexValidator.ATLEAST_ONE_LOWER_UPPER_CASE_CHARACTER,
    },
  ];

  resetPasswordForm: FormGroup;
  token: string;

  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get isLoading$() {
    return this._isLoading$.asObservable();
  }

  get passwordFcErrors() {
    return this.resetPasswordForm.get('password')?.errors || {};
  }

  constructor(
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') || '';
    const passwordValidators = [Validators.required, Validators.minLength(8)];

    this.validations.forEach((validation) => {
      passwordValidators.push(regexValidator(validation));
    });

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', passwordValidators],
      confirmPassword: ['', Validators.required],
    });
  }

  confirmPasswordClick() {
    if (
      this.resetPasswordForm.invalid ||
      this.resetPasswordForm.value.password !==
        this.resetPasswordForm.value.confirmPassword
    ) {
      return;
    }

    this._setLoadingstate(true);

    this.authService
      .resetPassword({
        password: this.resetPasswordForm.value.password,
        token: this.token,
      })
      .subscribe({
        next: () => {
          this._setLoadingstate(false);
          this.snackbarService.openSuccessSnackbar(
            'Success',
            'You have changed your password successfully.',
          );
          this.router.navigate(['auth', 'login']);
        },
        error: (err) => {
          this._setLoadingstate(false);
          this.snackbarService.openErrorSnackbar(err.error.message);
        },
      });
  }

  onBackToLogin() {
    this.router.navigate(['auth/login']);
  }

  private _setLoadingstate(isLoading: boolean) {
    this._isLoading$.next(isLoading);

    if (isLoading) {
      this.snackbarService.openLoadingSnackbar(
        'Please wait...',
        `Changing your password.`,
      );
      this.resetPasswordForm.disable();
    } else {
      this.snackbarService.closeLoadingSnackbar();
      this.resetPasswordForm.enable();
    }
  }
}

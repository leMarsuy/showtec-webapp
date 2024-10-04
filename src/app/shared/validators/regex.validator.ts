import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface RegexValidator {
  type: string;
  regex: string;
}

export function regexValidator(regexValidator: RegexValidator): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const regex = new RegExp(regexValidator.regex);
    const regexTest = regex.test(control.value);
    return regexTest ? null : { [regexValidator.type]: !regexTest };
  };
}

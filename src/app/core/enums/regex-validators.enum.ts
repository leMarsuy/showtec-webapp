export enum RegexValidator {
  NUMBER_ONLY = '^[0-9.]+$',
  PH_NUMBER_ONLY = '^9+.*$',

  URL_ONLY = '^(https?://|www.)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$',
  EMAIL_ONLY = '^[a-z0-9A-Z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',

  ATLEAST_ONE_NUMBER = '.*[0-9].*$',
  ATLEAST_ONE_SPECIAL_CHARACTER = `.*[ ~!@#$%^&*()_+{}\\[\\]=:;,.<>/?\`|-].*$`,
  ATLEAST_ONE_LOWER_CASE_CHARACTER = '.*[a-z].*$',
  ATLEAST_ONE_UPPER_CASE_CHARACTER = '.*[A-Z].*$',

  ATLEAST_ONE_LOWER_UPPER_CASE_CHARACTER = '.*(?=.*[a-z])(?=.*[A-Z]).*$',
}

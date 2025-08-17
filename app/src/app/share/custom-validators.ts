import { AbstractControl } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  return valid ? null : { weakPassword: true };
}

export function customEmailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (!value) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(value) ? null : { invalidEmail: true };
}

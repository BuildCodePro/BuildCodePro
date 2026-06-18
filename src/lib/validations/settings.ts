import type { ChangePasswordFormData } from "@/lib/constants/settings";

export interface ValidationResult<T> {
  success: boolean;
  errors: Partial<Record<keyof T, string>>;
}

function validatePassword(password: string): string | undefined {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return undefined;
}

function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return undefined;
}

export function validateChangePasswordForm(
  data: ChangePasswordFormData,
): ValidationResult<ChangePasswordFormData> {
  const errors: Partial<Record<keyof ChangePasswordFormData, string>> = {};

  if (!data.currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  const newPasswordError = validatePassword(data.newPassword);
  if (newPasswordError) {
    errors.newPassword = newPasswordError;
  }

  const confirmPasswordError = validatePasswordConfirmation(
    data.newPassword,
    data.confirmPassword,
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  if (
    data.currentPassword &&
    data.newPassword &&
    data.currentPassword === data.newPassword
  ) {
    errors.newPassword = "New password must be different from current password";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

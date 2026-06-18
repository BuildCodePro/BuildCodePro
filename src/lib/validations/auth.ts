import type {
  ForgotPasswordFormData,
  LoginFormData,
  ResetPasswordFormData,
  SignupFormData,
} from "@/types/auth";
import type { SignupTeamInviteFormData } from "@/types/team";

export interface ValidationResult<T> {
  success: boolean;
  errors: Partial<Record<keyof T, string>>;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return "Email is required";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }

  return undefined;
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

export function validateLoginForm(
  data: LoginFormData,
): ValidationResult<LoginFormData> {
  const errors: Partial<Record<keyof LoginFormData, string>> = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignupForm(
  data: SignupFormData,
): ValidationResult<SignupFormData> {
  const errors: Partial<Record<keyof SignupFormData, string>> = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!data.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validatePasswordConfirmation(
    data.password,
    data.confirmPassword,
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = "You must accept the terms to continue";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignupTeamInvite(
  data: SignupTeamInviteFormData,
  existingEmails: string[] = [],
): ValidationResult<SignupTeamInviteFormData> {
  const errors: Partial<Record<keyof SignupTeamInviteFormData, string>> = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  } else if (
    existingEmails.some(
      (email) => email.toLowerCase() === data.email.trim().toLowerCase(),
    )
  ) {
    errors.email = "This email has already been added";
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validatePasswordConfirmation(
    data.password,
    data.confirmPassword,
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateForgotPasswordForm(
  data: ForgotPasswordFormData,
): ValidationResult<ForgotPasswordFormData> {
  const errors: Partial<Record<keyof ForgotPasswordFormData, string>> = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateResetPasswordForm(
  data: ResetPasswordFormData,
): ValidationResult<ResetPasswordFormData> {
  const errors: Partial<Record<keyof ResetPasswordFormData, string>> = {};

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validatePasswordConfirmation(
    data.password,
    data.confirmPassword,
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

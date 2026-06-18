export type UserRole = "company" | "super_admin" | "estimator" | "engineer";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormData {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName?: string;
}

export interface AuthSession {
  user: AuthUser;
  createdAt: string;
}

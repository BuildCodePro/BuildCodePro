export type UserRole = "company_owner" | "super_admin" | "estimator" | "engineer";

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

export interface AcceptInviteFormData {
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  email: string;
  avatar_url?: string;
  name: string;
  role: UserRole;
  modules?:
  {
    ai_design_engine: boolean, bom_generation: boolean, pdf_export: boolean, compliance_engine: boolean, team_accounts: boolean,
    dedicated_support: boolean,
  }
  ai_design_engine?: boolean
  bom_generation?: boolean
  compliance_engine?: boolean
  csv_export?: boolean
  dedicated_support?: boolean
  pdf_export?: boolean
  team_accounts?: boolean
  companyName?: string;
  is_verified?: boolean;
  is_active?: boolean;
  is_owner?: boolean;
  company_id?: string;
  company?: {
    id: string;
    name: string;
    created_at: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  user: AuthUser;
  createdAt: string;
}

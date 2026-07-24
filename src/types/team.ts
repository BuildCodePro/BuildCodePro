import type { PlatformUserRole, PlatformUserStatus } from "@/types/super-admin";

export interface InviteTeamMemberFormData {
  // fullName: string;
  email: string;
  role: PlatformUserRole;
}

export interface SignupTeamInviteFormData extends InviteTeamMemberFormData {
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface SignupTeamInvite extends SignupTeamInviteFormData {
  id: string;
}

export interface CompanyTeamMember {
  id: string;
  name: string;
  email: string;
  role: PlatformUserRole;
  status: PlatformUserStatus;
  twoFactorEnabled: boolean;
  lastLogin: string;
  invitedAt?: string;
}

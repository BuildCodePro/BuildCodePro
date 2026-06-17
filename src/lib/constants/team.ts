import type { PlatformUserRole } from "@/types/super-admin";

export const TEAM_ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "company_admin", label: "Company Admin" },
  { value: "estimator", label: "Estimator" },
  { value: "engineer", label: "Engineer" },
] as const;

export const TEAM_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending Invite" },
  { value: "suspended", label: "Suspended" },
] as const;

export const INVITE_ROLE_OPTIONS: {
  value: PlatformUserRole;
  label: string;
  description: string;
}[] = [
  {
    value: "estimator",
    label: "Estimator",
    description: "Create designs, generate BOMs, and export bid reports",
  },
  {
    value: "engineer",
    label: "Engineer (PE)",
    description: "Review AI output, approve designs, and prepare permit packages",
  },
  {
    value: "company_admin",
    label: "Company Admin",
    description: "Full access including billing and team management",
  },
];

/** Roles available when inviting during company owner signup */
export const SIGNUP_INVITE_ROLE_OPTIONS = INVITE_ROLE_OPTIONS.filter(
  (option) => option.value !== "company_admin",
);

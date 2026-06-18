import type { DashboardStat } from "@/types/dashboard";
import type { CompanyTeamMember } from "@/types/team";

export const COMPANY_NAME = "Acme Fire Protection";

export const teamModuleStats: DashboardStat[] = [
  {
    id: "total-members",
    label: "Team Members",
    value: "4",
    change: { text: "1 pending invite", variant: "neutral" },
  },
  {
    id: "estimators",
    label: "Estimators",
    value: "1",
    change: { text: "Active", variant: "success" },
  },
  {
    id: "engineers",
    label: "Engineers",
    value: "1",
    change: { text: "Active", variant: "success" },
  },
  {
    id: "pending-invites",
    label: "Pending Invites",
    value: "1",
    change: { text: "Awaiting acceptance", variant: "warning" },
  },
];

export const companyTeamMembers: CompanyTeamMember[] = [
  {
    id: "team-1",
    name: "John Doe",
    email: "john@acmefire.com",
    role: "company_admin",
    status: "active",
    twoFactorEnabled: true,
    lastLogin: "Jun 9, 2025",
  },
  {
    id: "team-2",
    name: "Sarah Chen",
    email: "sarah@acmefire.com",
    role: "estimator",
    status: "active",
    twoFactorEnabled: false,
    lastLogin: "Jun 8, 2025",
  },
  {
    id: "team-3",
    name: "Mike Rodriguez, PE",
    email: "mike@acmefire.com",
    role: "engineer",
    status: "active",
    twoFactorEnabled: true,
    lastLogin: "Jun 7, 2025",
  },
  {
    id: "team-4",
    name: "Alex Turner",
    email: "alex@acmefire.com",
    role: "estimator",
    status: "pending",
    twoFactorEnabled: false,
    lastLogin: "—",
    invitedAt: "Jun 6, 2025",
  },
];

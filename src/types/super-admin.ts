export type CompanyPlan = "starter" | "professional" | "enterprise";
export type CompanyStatus = "active" | "trial" | "suspended";

export type PlatformUserRole = "company_admin" | "estimator" | "engineer";
export type PlatformUserStatus = "active" | "pending" | "suspended";

export type BillingCycle = "monthly" | "quarterly" | "semi-annual" | "annual";

export type TicketPriority = "low" | "medium" | "high";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketCategory = "billing" | "technical" | "account" | "general";

export interface PlatformCompany {
  id: string;
  name: string;
  email: string;
  plan: CompanyPlan;
  users: number;
  projects: number;
  designsUsed: number;
  designLimit: number | "unlimited";
  status: CompanyStatus;
  joinedAt: string;
  lastActive: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: PlatformUserRole;
  status: PlatformUserStatus;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export interface SubscriptionUsage {
  id: string;
  companyName: string;
  plan: CompanyPlan;
  designsUsed: number;
  designLimit: number | "unlimited";
  billingCycle: BillingCycle;
  monthlyAmount: number;
  nextBillingDate: string;
  atLimit: boolean;
}

export interface PlatformInvoice {
  id: string;
  company: string;
  date: string;
  plan: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

export interface SupportTicket {
  id: string;
  company: string;
  contactName: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  submittedAt: string;
}

export interface PlanDistributionItem {
  plan: string;
  count: number;
  revenue: string;
}

export interface PlatformActivity {
  id: string;
  message: string;
  timestamp: string;
  type: "signup" | "upgrade" | "design" | "support" | "billing";
}

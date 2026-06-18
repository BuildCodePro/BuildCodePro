export const COMPANY_PLAN_FILTER_OPTIONS = [
  { value: "all", label: "All Plans" },
  { value: "starter", label: "Starter" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
] as const;

export const COMPANY_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "suspended", label: "Suspended" },
] as const;

export const USER_ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "company_admin", label: "Company Admin" },
  { value: "estimator", label: "Estimator" },
  { value: "engineer", label: "Engineer" },
] as const;

export const USER_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending Verification" },
  { value: "suspended", label: "Suspended" },
] as const;

export const SUBSCRIPTION_PLAN_FILTER_OPTIONS = [
  { value: "all", label: "All Plans" },
  { value: "starter", label: "Starter" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
] as const;

export const TICKET_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
] as const;

export const TICKET_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

export const PLATFORM_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    designsPerMonth: 5,
    activeCompanies: 18,
  },
  {
    id: "professional",
    name: "Professional",
    price: 249,
    designsPerMonth: 25,
    activeCompanies: 24,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 599,
    designsPerMonth: "Unlimited" as const,
    activeCompanies: 6,
  },
] as const;

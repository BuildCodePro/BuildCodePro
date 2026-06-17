import type { AuthUser } from "@/types/auth";

interface MockUserRecord extends AuthUser {
  password: string;
}

/**
 * Mock credentials for local development until Supabase auth (Milestone 1).
 *
 * Company user  → contractor dashboard
 * Estimator     → estimation-focused dashboard
 * Engineer      → PE review & approval dashboard
 * Super admin   → platform administration dashboard
 */
export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "company-1",
    email: "john@acmefire.com",
    password: "Company@123",
    name: "John Doe",
    role: "company",
    companyName: "Acme Fire Protection",
  },
  {
    id: "estimator-1",
    email: "sarah@acmefire.com",
    password: "Estimator@123",
    name: "Sarah Chen",
    role: "estimator",
    companyName: "Acme Fire Protection",
  },
  {
    id: "engineer-1",
    email: "mike@acmefire.com",
    password: "Engineer@123",
    name: "Mike Rodriguez, PE",
    role: "engineer",
    companyName: "Acme Fire Protection",
  },
  {
    id: "super-admin-1",
    email: "admin@buildcodepro.com",
    password: "SuperAdmin@123",
    name: "Platform Admin",
    role: "super_admin",
  },
];

export const MOCK_LOGIN_CREDENTIALS = {
  company: {
    email: "john@acmefire.com",
    password: "Company@123",
    label: "Company (Contractor)",
  },
  estimator: {
    email: "sarah@acmefire.com",
    password: "Estimator@123",
    label: "Estimator",
  },
  engineer: {
    email: "mike@acmefire.com",
    password: "Engineer@123",
    label: "Engineer (PE Reviewer)",
  },
  superAdmin: {
    email: "admin@buildcodepro.com",
    password: "SuperAdmin@123",
    label: "Super Admin",
  },
} as const;

export function authenticateMockUser(
  email: string,
  password: string,
): AuthUser | null {
  const user = MOCK_USERS.find(
    (record) =>
      record.email.toLowerCase() === email.trim().toLowerCase() &&
      record.password === password,
  );

  if (!user) {
    return null;
  }

  const { password: _password, ...authUser } = user;
  return authUser;
}

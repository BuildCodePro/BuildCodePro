import type { AuthSession, UserRole } from "@/types/auth";

const SESSION_STORAGE_KEY = "buildcodepro-auth-session";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(user: AuthSession["user"]): AuthSession {
  const session: AuthSession = {
    user,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  return session;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export function logout(): void {
  clearSession();
}

export function getDashboardPathForRole(role: UserRole): string {
  if (role === "super_admin") {
    return "/super-admin";
  }
  if (role === "estimator") {
    return "/estimator";
  }
  if (role === "engineer") {
    return "/engineer";
  }
  return "/dashboard";
}

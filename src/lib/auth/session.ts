import type { UserRole } from "@/types/auth";
import { useAuthStore } from "@/store/auth-store";

export function clearSession(): void {
  useAuthStore.getState().clearSession();
}

export function logout(): void {
  clearSession();
  if (typeof window !== "undefined") {
    localStorage.removeItem("build-auth");
  }
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
  // Company owner defaults to /company/dashboard
  return "/company/dashboard";
}

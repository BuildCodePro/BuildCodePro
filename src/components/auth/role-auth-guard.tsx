"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { routes } from "@/config/routes";
import { getDashboardPathForRole } from "@/lib/auth/session";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types/auth";

interface RoleAuthGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleAuthGuard({ allowedRoles, children }: RoleAuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user, accessToken, role, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for the auth store to hydrate from local storage
    if (!_hasHydrated) return;

    if (!user || !accessToken) {
      router.replace(routes.login);
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      router.replace(getDashboardPathForRole(role));
      return;
    }

    setIsAuthorized(true);
  }, [allowedRoles, router, user, accessToken, role, _hasHydrated]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

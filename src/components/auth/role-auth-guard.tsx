"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { routes } from "@/config/routes";
import {
  getDashboardPathForRole,
  getSession,
} from "@/lib/auth/session";
import type { UserRole } from "@/types/auth";

interface RoleAuthGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleAuthGuard({ allowedRoles, children }: RoleAuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace(routes.login);
      return;
    }

    if (!allowedRoles.includes(session.user.role)) {
      router.replace(getDashboardPathForRole(session.user.role));
      return;
    }

    setIsAuthorized(true);
  }, [allowedRoles, router]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

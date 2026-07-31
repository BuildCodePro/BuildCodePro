"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getDashboardPathForRole } from "@/lib/auth/session";
import { useAuthStore } from "@/store/auth-store";

interface GuestAuthGuardProps {
  children: React.ReactNode;
}

const AUTH_GUARD_EXEMPT_ROUTES = ["/verify-email-change"];

function isExemptRoute(pathname: string): boolean {
  return AUTH_GUARD_EXEMPT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function GuestAuthGuard({ children }: GuestAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isGuest, setIsGuest] = useState(false);
  const { user, accessToken, role, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for the auth store to hydrate from local storage
    if (!_hasHydrated) return;

    if (isExemptRoute(pathname)) {
      setIsGuest(true);
      return;
    }

    if (user && accessToken && role) {
      router.replace(getDashboardPathForRole(role));
      return;
    }

    setIsGuest(true);
  }, [router, pathname, user, accessToken, role, _hasHydrated]);

  if (!isGuest) {
    return null;
  }

  return <>{children}</>;
}
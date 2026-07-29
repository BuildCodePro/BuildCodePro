"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getDashboardPathForRole } from "@/lib/auth/session";
import { useAuthStore } from "@/store/auth-store";

interface GuestAuthGuardProps {
  children: React.ReactNode;
}

// Routes that must remain accessible even to an already-authenticated
// user — these are triggered from inside the logged-in app (e.g. clicking
// a verification link sent while the user is signed in), not part of the
// signed-out auth flow, so they should never redirect to the dashboard.
const AUTH_GUARD_EXEMPT_ROUTES = ["/verify-email-change"];

function isExemptRoute(pathname: string): boolean {
  return AUTH_GUARD_EXEMPT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/**
 * Prevents authenticated users from viewing auth screens (login, signup, etc.).
 * Redirects to the correct dashboard instead of allowing back-navigation to login.
 *
 * A small allowlist of routes (see AUTH_GUARD_EXEMPT_ROUTES) stays reachable
 * even for logged-in users, since those flows are meant to run while
 * authenticated (e.g. verifying an email change requested from Settings).
 */
export function GuestAuthGuard({ children }: GuestAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isGuest, setIsGuest] = useState(false);
  const { user, accessToken, role, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for the auth store to hydrate from local storage
    if (!_hasHydrated) return;

    // Exempt routes are allowed to render regardless of auth state.
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
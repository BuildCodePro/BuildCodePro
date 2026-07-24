"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getDashboardPathForRole } from "@/lib/auth/session";
import { useAuthStore } from "@/store/auth-store";

interface GuestAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Prevents authenticated users from viewing auth screens (login, signup, etc.).
 * Redirects to the correct dashboard instead of allowing back-navigation to login.
 */
export function GuestAuthGuard({ children }: GuestAuthGuardProps) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);
  const { user, accessToken, role, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for the auth store to hydrate from local storage
    if (!_hasHydrated) return;

    if (user && accessToken && role) {
      router.replace(getDashboardPathForRole(role));
      return;
    }

    setIsGuest(true);
  }, [router, user, accessToken, role, _hasHydrated]);

  if (!isGuest) {
    return null;
  }

  return <>{children}</>;
}

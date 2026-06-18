"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getDashboardPathForRole,
  getSession,
} from "@/lib/auth/session";

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

  useEffect(() => {
    const session = getSession();

    if (session) {
      router.replace(getDashboardPathForRole(session.user.role));
      return;
    }

    setIsGuest(true);
  }, [router]);

  if (!isGuest) {
    return null;
  }

  return <>{children}</>;
}

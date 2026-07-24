"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getDashboardPathForRole } from "@/lib/auth/session";
import { useAuthStore } from "@/store/auth-store";

export function LandingAuthRedirect() {
  const router = useRouter();
  const { user, accessToken, role, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (user && accessToken && role) {
      router.replace(getDashboardPathForRole(role));
    }
  }, [router, user, accessToken, role, _hasHydrated]);

  return null;
}

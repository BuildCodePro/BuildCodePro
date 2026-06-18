"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  getDashboardPathForRole,
  getSession,
} from "@/lib/auth/session";

export function LandingAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace(getDashboardPathForRole(session.user.role));
    }
  }, [router]);

  return null;
}

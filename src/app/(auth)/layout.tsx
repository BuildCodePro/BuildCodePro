import type { ReactNode } from "react";

import { GuestAuthGuard } from "@/components/auth/guest-auth-guard";

interface AuthGroupLayoutProps {
  children: ReactNode;
}

export default function AuthGroupLayout({ children }: AuthGroupLayoutProps) {
  return <GuestAuthGuard>{children}</GuestAuthGuard>;
}

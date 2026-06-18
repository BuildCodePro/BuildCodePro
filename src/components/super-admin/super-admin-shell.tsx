"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getSuperAdminPageTitle } from "@/lib/utils/get-super-admin-page-title";
import { getSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

import { SuperAdminHeader } from "./super-admin-header";
import { SuperAdminSidebar } from "./super-admin-sidebar";

interface SuperAdminShellProps {
  children: React.ReactNode;
}

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  const pathname = usePathname();
  const title = getSuperAdminPageTitle(pathname);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [userName, setUserName] = useState("Platform Admin");

  useEffect(() => {
    const session = getSession();
    if (session?.user.name) {
      setUserName(session.user.name);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden md:flex">
        <SuperAdminSidebar className="sticky top-0 h-screen" />
      </div>

      {isMobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileNavOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:hidden",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SuperAdminSidebar
          className="h-full shadow-xl"
          onNavigate={() => setIsMobileNavOpen(false)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <SuperAdminHeader
          title={title}
          userName={userName}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />
        <main className="w-full flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { getPageTitle } from "@/lib/utils/get-page-title";
import { cn } from "@/lib/utils/cn";

import { DashboardHeader } from "./dashboard-header";
import { Sidebar } from "./sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden lg:flex">
        <Sidebar className="sticky top-0 h-screen" />
      </div>

      {isMobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileNavOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:hidden",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          className="h-full shadow-xl"
          onNavigate={() => setIsMobileNavOpen(false)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title={title}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />
        <main className="w-full flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

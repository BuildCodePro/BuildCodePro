"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getEstimatorPageTitle } from "@/lib/utils/get-estimator-page-title";
import { getSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

import { EstimatorHeader } from "./estimator-header";
import { EstimatorSidebar } from "./estimator-sidebar";

interface EstimatorShellProps {
  children: React.ReactNode;
}

export function EstimatorShell({ children }: EstimatorShellProps) {
  const pathname = usePathname();
  const title = getEstimatorPageTitle(pathname);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [userName, setUserName] = useState("Estimator");

  useEffect(() => {
    const session = getSession();
    if (session?.user.name) {
      setUserName(session.user.name);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden md:flex">
        <EstimatorSidebar className="sticky top-0 h-screen" />
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
        <EstimatorSidebar
          className="h-full shadow-xl"
          onNavigate={() => setIsMobileNavOpen(false)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <EstimatorHeader
          title={title}
          userName={userName}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />
        <main className="w-full flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

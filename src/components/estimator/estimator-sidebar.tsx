"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calculator, LogOut } from "lucide-react";

import { SidebarNavItem } from "@/components/dashboard/sidebar-nav-item";
import { Logo } from "@/components/icons/logo";
import { estimatorNavigation } from "@/config/estimator-navigation";
import { routes } from "@/config/routes";
import { logout } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

interface EstimatorSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function EstimatorSidebar({
  className,
  onNavigate,
}: EstimatorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.replace(routes.login);
  };

  const isNavActive = (href: string) => {
    if (href === routes.estimator.dashboard) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={cn(
        "flex h-full w-[260px] shrink-0 flex-col bg-sidebar",
        className,
      )}
    >
      <div className="relative flex h-[72px] shrink-0 items-center justify-center px-4">
        <Link
          href={routes.estimator.dashboard}
          className="flex items-center justify-center"
          onClick={onNavigate}
          aria-label="BuildCode Pro estimator home"
        >
          <Logo height={44} className="h-11 w-auto" />
        </Link>
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-white/10"
          aria-hidden="true"
        />
      </div>

      <div className="px-4 pt-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-xs font-medium text-emerald-400">
          <Calculator className="size-3.5" aria-hidden="true" />
          Estimator
        </span>
      </div>

      <nav className="flex flex-1 flex-col items-stretch gap-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {estimatorNavigation.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={isNavActive(item.href)}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="mx-4 mb-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-[41px] w-full items-center gap-[14px] rounded-[10px] border border-white/10 px-[14px] py-3 font-body text-sm font-medium text-sidebar-foreground transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-[18px] shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}

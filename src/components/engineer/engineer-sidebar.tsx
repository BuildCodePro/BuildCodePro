"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HardHat, LogOut } from "lucide-react";

import { SidebarNavItem } from "@/components/dashboard/sidebar-nav-item";
import { Logo } from "@/components/icons/logo";
import { engineerNavigation } from "@/config/engineer-navigation";
import { routes } from "@/config/routes";
import { logout } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

interface EngineerSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function EngineerSidebar({
  className,
  onNavigate,
}: EngineerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.replace(routes.login);
  };

  const isNavActive = (href: string) => {
    if (href === routes.engineer.dashboard) {
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
          href={routes.engineer.dashboard}
          className="flex items-center justify-center"
          onClick={onNavigate}
          aria-label="BuildCode Pro engineer home"
        >
          <Logo height={44} className="h-11 w-auto" />
        </Link>
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-white/10"
          aria-hidden="true"
        />
      </div>

      <div className="px-4 pt-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-xs font-medium text-amber-400">
          <HardHat className="size-3.5" aria-hidden="true" />
          PE Reviewer
        </span>
      </div>

      <nav className="flex flex-1 flex-col items-stretch gap-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {engineerNavigation.map((item) => (
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

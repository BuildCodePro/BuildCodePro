"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";

import { Logo } from "@/components/icons/logo";
import { getMainNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { logout } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

import { SidebarNavItem } from "./sidebar-nav-item";
import { LogoutModal } from "@/components/auth/logout-model";
import { useAuthStore } from "@/store/auth-store";


interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigation = hasHydrated
    ? getMainNavigation({
      role: user?.role,
      modules: {
        team_accounts: user?.modules?.team_accounts,
        dedicated_support: user?.modules?.dedicated_support,
      },
    })
    : [];

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.replace(routes.login);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    handleLogout();
  };

  return (
    <aside
      className={cn(
        "flex h-full w-[260px] shrink-0 flex-col bg-sidebar",
        className,
      )}
    >
      {/* Logo zone — height must match DashboardHeader (h-[72px]) so dividers align */}
      <div className="relative flex h-[72px] shrink-0 items-center justify-center px-4">
        <Link
          href={routes.dashboard}
          className="flex items-center justify-center"
          onClick={onNavigate}
          aria-label="BuildCode Pro home"
        >
          <Logo height={44} className="h-11 w-auto" />
        </Link>
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-white/10"
          aria-hidden="true"
        />
      </div>

      <nav className="flex flex-1 flex-col items-stretch gap-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navigation.map((item: any) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="mx-4 mb-6">
        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex h-[41px] w-full items-center gap-[14px] rounded-[10px] border border-white/10 px-[14px] py-3 font-body text-sm font-medium text-sidebar-foreground transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-[18px] shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </aside>
  );
}
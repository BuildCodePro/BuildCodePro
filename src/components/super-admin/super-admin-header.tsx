"use client";

import { Bell, ChevronDown, Menu } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";

interface SuperAdminHeaderProps {
  title: string;
  userName?: string;
  onMenuClick?: () => void;
  className?: string;
}

export function SuperAdminHeader({
  title,
  userName = "Platform Admin",
  onMenuClick,
  className,
}: SuperAdminHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-4 border-b border-border bg-white px-4 sm:gap-6 sm:px-6",
        className,
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-border text-foreground md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </button>

      <h1 className="text-page-title shrink-0 text-foreground">{title}</h1>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-[20px] border border-border p-2.5 text-foreground transition-colors hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-[10px] px-1 py-1 transition-colors hover:bg-slate-50"
          aria-label="User menu"
        >
          <Avatar name={userName} />
          <span className="hidden font-body text-sm font-medium text-foreground sm:inline">
            {userName}
          </span>
          <ChevronDown className="hidden size-4 text-slate-400 sm:inline" />
        </button>
      </div>
    </header>
  );
}

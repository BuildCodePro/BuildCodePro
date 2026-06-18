import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface SidebarNavItemProps {
  item: {
    label: string;
    href: string;
    icon: LucideIcon;
  };
  isActive: boolean;
  onClick?: () => void;
}

export function SidebarNavItem({ item, isActive, onClick }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex h-[41px] w-full items-center gap-[14px] rounded-[10px] px-[14px] py-3 font-body text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-white"
          : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      {item.label}
    </Link>
  );
}

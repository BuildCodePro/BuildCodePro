import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  HeadphonesIcon,
  LayoutDashboard,
  PlusCircle,
  Settings,
  FolderKanban,
  Users,
} from "lucide-react";

import { routes } from "@/config/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const mainNavigation: NavItem[] = [
  { label: "Dashboard", href: routes.dashboard, icon: LayoutDashboard },
  { label: "New Design", href: routes.newDesign, icon: PlusCircle },
  { label: "Projects", href: routes.projects, icon: FolderKanban },
  { label: "Team", href: routes.team, icon: Users },
  { label: "Billing", href: routes.billing, icon: CreditCard },
  { label: "Settings", href: routes.settings, icon: Settings },
  { label: "Support", href: routes.support, icon: HeadphonesIcon },
];

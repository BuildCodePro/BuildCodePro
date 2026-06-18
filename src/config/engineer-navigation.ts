import type { LucideIcon } from "lucide-react";
import {
  FolderKanban,
  HeadphonesIcon,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import { routes } from "@/config/routes";

export interface EngineerNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** PRD §11 for PE reviewers — no billing, no new design (review-only role). */
export const engineerNavigation: EngineerNavItem[] = [
  {
    label: "Dashboard",
    href: routes.engineer.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: routes.engineer.projects,
    icon: FolderKanban,
  },
  {
    label: "Settings",
    href: routes.engineer.settings,
    icon: Settings,
  },
  {
    label: "Support",
    href: routes.engineer.support,
    icon: HeadphonesIcon,
  },
];

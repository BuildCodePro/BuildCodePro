import type { LucideIcon } from "lucide-react";
import {
  FolderKanban,
  HeadphonesIcon,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react";

import { routes } from "@/config/routes";

export interface EstimatorNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Matches PRD §11 Screen Inventory — no billing (company admin only). */
export const estimatorNavigation: EstimatorNavItem[] = [
  {
    label: "Dashboard",
    href: routes.estimator.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "New Design",
    href: routes.estimator.newDesign,
    icon: PlusCircle,
  },
  {
    label: "Projects",
    href: routes.estimator.projects,
    icon: FolderKanban,
  },
  {
    label: "Settings",
    href: routes.estimator.settings,
    icon: Settings,
  },
  {
    label: "Support",
    href: routes.estimator.support,
    icon: HeadphonesIcon,
  },
];

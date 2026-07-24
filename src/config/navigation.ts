import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  HeadphonesIcon,
  LayoutDashboard,
  PlusCircle,
  Settings,
  FolderKanban,
  Users,
  Bell,
} from "lucide-react";

import { routes } from "@/config/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavigationPermissions {
  team_accounts?: boolean;
  dedicated_support?: boolean;
}

export const getMainNavigation = (
  user?: NavigationPermissions
): NavItem[] => [
  {
    label: "Dashboard",
    href: routes.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "New Design",
    href: routes.newDesign,
    icon: PlusCircle,
  },
  {
    label: "Projects",
    href: routes.projects,
    icon: FolderKanban,
  },

  ...(user?.team_accounts
    ? [
        {
          label: "Team",
          href: routes.team,
          icon: Users,
        },
      ]
    : []),

  {
    label: "Billing",
    href: routes.billing,
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: routes.settings,
    icon: Settings,
  },

  ...(user?.dedicated_support
    ? [
        {
          label: "Support",
          href: routes.support,
          icon: HeadphonesIcon,
        },
      ]
    : []),

  {
    label: "Notifications",
    href: routes.notification,
    icon: Bell,
  },
];
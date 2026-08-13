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
  BellCheck,
} from "lucide-react";

import { routes } from "@/config/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavigationModules {
  team_accounts?: boolean;
  dedicated_support?: boolean;
}

interface NavigationUser {
  role?: string;
  modules?: NavigationModules;
}

export const getMainNavigation = (user?: NavigationUser): NavItem[] => {
  // Module-based gating only applies to the company_owner role — every
  // other role (estimator, engineer, super_admin, etc.) always sees
  // these nav items regardless of the plan's modules.
  const isRestrictedRole = user?.role === "company_owner";

  const canSeeTeam = isRestrictedRole
    ? Boolean(user?.modules?.team_accounts)
    : true;

  const canSeeSupport = isRestrictedRole
    ? Boolean(user?.modules?.dedicated_support)
    : true;

  return [
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

    ...(canSeeTeam
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

    ...(canSeeSupport
      ? [
        {
          label: "Support",
          href: routes.support,
          icon: HeadphonesIcon,
        },
      ]
      : []),

    // {
    //   label: "Notifications",
    //   href: routes.notification,
    //   icon: Bell,
    // },
  ];
};